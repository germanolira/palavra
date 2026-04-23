const fs = require('fs');
const path = require('path');

// Read dailySeed.ts to get existing words
const seedPath = path.join(__dirname, '..', 'data', 'dailySeed.ts');
const seedContent = fs.readFileSync(seedPath, 'utf-8');
const seedWords = new Set([...seedContent.matchAll(/word:\s*'([A-Z]+)'/g)].map(m => m[1].toLowerCase()));
console.log(`Existing words in dailySeed: ${seedWords.size}`);

// Read all batch files
const batchDir = __dirname;
const batchFiles = fs.readdirSync(batchDir)
  .filter(f => f.match(/^batch_/) && f.match(/\.(ts|js)$/))
  .sort()
  .map(f => path.join(batchDir, f));

const allEntries = [];
const seenWords = new Set();
const issues = [];

batchFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const wordMatches = [...content.matchAll(/word:\s*'([A-Z]+)'/g)];
  const diffMatches = [...content.matchAll(/difficulty:\s*'(common|medium|rare)'/g)];
  const tagMatches = [...content.matchAll(/tags:\s*\[([^\]]+)\]/g)];
  
  wordMatches.forEach((m, i) => {
    const word = m[1];
    const diff = diffMatches[i] ? diffMatches[i][1] : 'MISSING';
    const tags = tagMatches[i] ? tagMatches[i][1].replace(/'/g, '').split(',').map(t => t.trim()).filter(t => t) : [];
    const lower = word.toLowerCase();
    
    if (word.length !== 5) {
      issues.push(`SKIP (length): "${word}" from ${path.basename(file)}`);
      return;
    }
    if (!/^[A-Z]+$/.test(word)) {
      issues.push(`SKIP (non-alpha): "${word}" from ${path.basename(file)}`);
      return;
    }
    if (seedWords.has(lower)) {
      issues.push(`SKIP (in dailySeed): "${word}" from ${path.basename(file)}`);
      return;
    }
    if (seenWords.has(lower)) {
      issues.push(`SKIP (duplicate): "${word}" from ${path.basename(file)}`);
      return;
    }
    
    seenWords.add(lower);
    allEntries.push({ word, difficulty: diff, tags });
  });
});

console.log(`\n=== CONSOLIDATION RESULTS ===`);
console.log(`Valid unique words: ${allEntries.length}`);
console.log(`Issues found: ${issues.length}`);

const counts = { common: 0, medium: 0, rare: 0 };
allEntries.forEach(e => counts[e.difficulty]++);
console.log(`Distribution: common=${counts.common}(${Math.round(counts.common/allEntries.length*100)}%) medium=${counts.medium}(${Math.round(counts.medium/allEntries.length*100)}%) rare=${counts.rare}(${Math.round(counts.rare/allEntries.length*100)}%)`);

// Save consolidated file
const output = `import { SeedWord } from '../data/dailySeed';

export const generatedWords: SeedWord[] = [
${allEntries.map(e => `  { word: '${e.word}', difficulty: '${e.difficulty}', tags: [${e.tags.map(t => `'${t}'`).join(', ')}] },`).join('\n')}
];
`;

fs.writeFileSync(path.join(batchDir, 'consolidated.ts'), output);
console.log(`\nSaved to consolidated.ts`);

// Also save just the word list for gap filling
const wordList = allEntries.map(e => e.word).join('\n');
fs.writeFileSync(path.join(batchDir, 'wordlist.txt'), wordList);
console.log(`Saved word list to wordlist.txt`);
