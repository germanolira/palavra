var fs = require('fs');
var path = require('path');

var inputPath = path.join(__dirname, '..', 'data', 'br-utf8-5-letras.txt');
var outputWordlistPath = path.join(__dirname, '..', 'data', 'wordlist.ts');
var outputDailySeedPath = path.join(__dirname, '..', 'data', 'dailySeed.ts');

var content = fs.readFileSync(inputPath, 'utf8');
var lines = content.split('\n');

function normalize(word) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase();
}

var wordSet = new Set();
var words = [];

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var trimmed = line.trim();
  if (!trimmed) continue;
  
  var normalized = normalize(trimmed);
  
  if (/^[A-Z]{5}$/.test(normalized) && !wordSet.has(normalized)) {
    wordSet.add(normalized);
    words.push(normalized);
  }
}

console.log('Total valid unique words: ' + words.length);

var wordlistContent = 'export const WORDLIST = [\n';
for (var j = 0; j < words.length; j++) {
  wordlistContent += '  "' + words[j] + '"';
  if (j < words.length - 1) wordlistContent += ',';
  wordlistContent += '\n';
}
wordlistContent += '];\n';

fs.writeFileSync(outputWordlistPath, wordlistContent, 'utf8');
console.log('Saved wordlist.ts with ' + words.length + ' words');

var dailySeedContent = 'export type Difficulty = "common" | "medium" | "rare";\n\n';
dailySeedContent += 'export type WordTag =\n  | "nature"\n  | "object"\n  | "people"\n  | "social"\n  | "feeling"\n  | "place"\n  | "action"\n  | "descriptor"\n  | "time"\n  | "animal";\n\n';
dailySeedContent += 'export interface SeedWord {\n  word: string;\n  difficulty: Difficulty;\n  tags: WordTag[];\n}\n\n';
dailySeedContent += 'export interface DailySeed {\n  baseDate: string;\n  words: SeedWord[];\n}\n\n';
dailySeedContent += '/**\n * Dicionario de palavras do jogo Palavra.\n *\n * Fonte: https://github.com/Gpossas/Termo/blob/main/br-utf8.txt-5-letras.txt\n * Processado: ' + words.length + ' palavras unicas, 5 letras, sem acentos\n */\nexport const dailySeed: DailySeed = {\n  baseDate: "2026-04-22",\n  words: [\n';

for (var k = 0; k < words.length; k++) {
  dailySeedContent += '    { word: "' + words[k] + '", difficulty: "common", tags: ["object"] }';
  if (k < words.length - 1) dailySeedContent += ',';
  dailySeedContent += '\n';
}
dailySeedContent += '  ]\n};\n';

fs.writeFileSync(outputDailySeedPath, dailySeedContent, 'utf8');
console.log('Saved dailySeed.ts with ' + words.length + ' words');
