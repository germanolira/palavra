const fs = require('fs');
const path = require('path');

// Read consolidated.ts
const consolidatedPath = path.join(__dirname, 'consolidated.ts');
const content = fs.readFileSync(consolidatedPath, 'utf-8');

// Parse entries
const entries = [];
const wordRegex = /word:\s*'([A-Z]+)'/g;
const diffRegex = /difficulty:\s*'(common|medium|rare)'/g;
const tagRegex = /tags:\s*\[([^\]]+)\]/g;

const words = [...content.matchAll(wordRegex)];
const diffs = [...content.matchAll(diffRegex)];
const tags = [...content.matchAll(tagRegex)];

for (let i = 0; i < words.length; i++) {
  entries.push({
    word: words[i][1],
    difficulty: diffs[i]?.[1] || 'common',
    tags: tags[i]?.[1].replace(/'/g, '').split(',').map(t => t.trim()).filter(t => t) || []
  });
}

// Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Target distribution for 1000 words
const TARGET_COMMON = 600;
const TARGET_MEDIUM = 300;
const TARGET_RARE = 100;

const common = shuffle(entries.filter(e => e.difficulty === 'common'));
const medium = shuffle(entries.filter(e => e.difficulty === 'medium'));
const rare = shuffle(entries.filter(e => e.difficulty === 'rare'));

console.log(`Available: common=${common.length}, medium=${medium.length}, rare=${rare.length}`);

// We need more medium words. Convert some rare and common to medium if needed.
// First, try to convert some rare to medium
let mediumNeeded = TARGET_MEDIUM - medium.length;
const rareToConvert = Math.min(mediumNeeded, rare.length - TARGET_RARE);
const convertedRare = rare.splice(0, rareToConvert).map(e => ({ ...e, difficulty: 'medium' }));
medium.push(...convertedRare);
mediumNeeded -= rareToConvert;

// If still need more medium, convert some common
if (mediumNeeded > 0) {
  const commonToConvert = Math.min(mediumNeeded, common.length - TARGET_COMMON);
  const convertedCommon = common.splice(0, commonToConvert).map(e => ({ ...e, difficulty: 'medium' }));
  medium.push(...convertedCommon);
}

// Select final words
const finalCommon = common.slice(0, TARGET_COMMON);
const finalMedium = medium.slice(0, TARGET_MEDIUM);
const finalRare = rare.slice(0, TARGET_RARE);

const finalWords = shuffle([...finalCommon, ...finalMedium, ...finalRare]);

console.log(`Final: common=${finalCommon.length}, medium=${finalMedium.length}, rare=${finalRare.length}, total=${finalWords.length}`);

// Read existing dailySeed.ts
const seedPath = path.join(__dirname, '..', 'data', 'dailySeed.ts');
const seedContent = fs.readFileSync(seedPath, 'utf-8');

// Extract existing words from dailySeed
const existingWords = [...seedContent.matchAll(/word:\s*'([A-Z]+)'/g)].map(m => m[1]);

// Keep existing 73 words and add new ones to reach ~1000
// Actually, let's combine existing + new to get ~1000 total
// Existing has 73 words, so we need ~927 new ones
// But some existing words might be in our new list too, so let's deduplicate

const existingSet = new Set(existingWords.map(w => w.toLowerCase()));
const uniqueNewWords = finalWords.filter(e => !existingSet.has(e.word.toLowerCase()));

// We want total ~1000. Existing = 73. So we need 927 new.
const neededNew = 1000 - existingWords.length;
const selectedNew = uniqueNewWords.slice(0, neededNew);

console.log(`Existing: ${existingWords.length}, New unique: ${uniqueNewWords.length}, Selected new: ${selectedNew.length}, Total: ${existingWords.length + selectedNew.length}`);

// Generate output
const existingEntries = [];
for (let i = 0; i < existingWords.length; i++) {
  const w = existingWords[i];
  const diffMatch = seedContent.match(new RegExp(`word:\\s*'${w}'[^}]*difficulty:\\s*'(common|medium|rare)'`));
  const tagMatch = seedContent.match(new RegExp(`word:\\s*'${w}'[^}]*tags:\\s*\\[([^\\]]+)\\]`));
  existingEntries.push({
    word: w,
    difficulty: diffMatch?.[1] || 'common',
    tags: tagMatch?.[1].replace(/'/g, '').split(',').map(t => t.trim()).filter(t => t) || []
  });
}

const allFinal = shuffle([...existingEntries, ...selectedNew]);

// Generate the TypeScript file
const output = `export type Difficulty = 'common' | 'medium' | 'rare';

export type WordTag =
  | 'nature'
  | 'object'
  | 'people'
  | 'social'
  | 'feeling'
  | 'place'
  | 'action'
  | 'descriptor'
  | 'time'
  | 'animal';

export interface SeedWord {
  word: string;
  difficulty: Difficulty;
  tags: WordTag[];
}

export interface DailySeed {
  baseDate: string;
  words: SeedWord[];
}

/**
 * Dicionário de palavras do jogo Palavra.
 *
 * Regras de manutenção:
 * 1. Todas as palavras DEVEM ter exatamente 5 letras.
 * 2. Não pode haver palavras duplicadas (case-insensitive).
 * 3. Apenas letras A-Z sem acentos ou caracteres especiais.
 * 4. difficulty segue a distribuição alvo: ~60% common, ~30% medium, ~10% rare.
 * 5. tags garantem variedade semântica (natureza, objetos, pessoas, ações, etc.).
 */
export const dailySeed: DailySeed = {
  baseDate: '2026-04-22',
  words: [
${allFinal.map(e => `    { word: '${e.word}', difficulty: '${e.difficulty}', tags: [${e.tags.map(t => `'${t}'`).join(', ')}] },`).join('\n')}
  ],
};
`;

fs.writeFileSync(seedPath, output);
console.log(`\n✅ Updated dailySeed.ts with ${allFinal.length} words`);

// Verify
const counts = { common: 0, medium: 0, rare: 0 };
allFinal.forEach(e => counts[e.difficulty]++);
console.log(`Final distribution: common=${counts.common}(${Math.round(counts.common/allFinal.length*100)}%), medium=${counts.medium}(${Math.round(counts.medium/allFinal.length*100)}%), rare=${counts.rare}(${Math.round(counts.rare/allFinal.length*100)}%)`);
