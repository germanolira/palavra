const fs = require('fs');
const path = require('path');

function validateBatchFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const wordRegex = /word:\s*'([A-Z]+)'/g;
  const diffRegex = /difficulty:\s*'(common|medium|rare)'/g;
  
  const wordMatches = [...content.matchAll(wordRegex)];
  const diffMatches = [...content.matchAll(diffRegex)];
  
  const issues = [];
  const allWordsLower = [];
  const counts = { common: 0, medium: 0, rare: 0 };
  
  for (let i = 0; i < wordMatches.length; i++) {
    const word = wordMatches[i][1];
    const diff = diffMatches[i] ? diffMatches[i][1] : 'MISSING';
    
    if (word.length !== 5) {
      issues.push(`WRONG LENGTH: "${word}" has ${word.length} letters`);
    }
    if (!/^[A-Z]+$/.test(word)) {
      issues.push(`NON ALPHA: "${word}"`);
    }
    if (allWordsLower.includes(word.toLowerCase())) {
      issues.push(`DUPLICATE: "${word}"`);
    }
    
    allWordsLower.push(word.toLowerCase());
    if (counts[diff] !== undefined) counts[diff]++;
    else issues.push(`BAD DIFFICULTY: "${word}" has "${diff}"`);
  }
  
  const total = wordMatches.length;
  const basename = path.basename(filePath);
  console.log(`\n=== ${basename} ===`);
  console.log(`Total: ${total}`);
  console.log(`Dist: common=${counts.common}(${(counts.common/total*100||0).toFixed(0)}%) medium=${counts.medium}(${(counts.medium/total*100||0).toFixed(0)}%) rare=${counts.rare}(${(counts.rare/total*100||0).toFixed(0)}%)`);
  
  if (issues.length > 0) {
    console.log(`ISSUES (${issues.length}):`);
    issues.forEach(i => console.log(`  - ${i}`));
  } else {
    console.log(`ALL VALID`);
  }
  
  return { total, issues, wordsLower: allWordsLower, counts };
}

function checkCrossBatchDuplicates(results) {
  const seen = new Map();
  const dupes = [];
  
  results.forEach((r, idx) => {
    r.wordsLower.forEach(w => {
      if (seen.has(w)) {
        dupes.push(`"${w}" in batch${seen.get(w)+1} and batch${idx+1}`);
      } else {
        seen.set(w, idx);
      }
    });
  });
  
  console.log(`\n=== CROSS-BATCH ===`);
  if (dupes.length > 0) {
    console.log(`DUPLICATES (${dupes.length}):`);
    dupes.forEach(d => console.log(`  - ${d}`));
  } else {
    console.log(`No cross-batch duplicates!`);
  }
  console.log(`Total unique: ${seen.size}`);
  return dupes;
}

function checkAgainstExisting(results) {
  const seedPath = path.join(__dirname, '..', 'data', 'dailySeed.ts');
  if (!fs.existsSync(seedPath)) {
    console.log('(dailySeed.ts not found, skipping overlap check)');
    return [];
  }
  const seedContent = fs.readFileSync(seedPath, 'utf-8');
  const seedWords = [...seedContent.matchAll(/word:\s*'([A-Z]+)'/g)].map(m => m[1].toLowerCase());
  
  const overlaps = [];
  results.forEach((r, idx) => {
    r.wordsLower.forEach(w => {
      if (seedWords.includes(w)) {
        overlaps.push(`"${w}" already in dailySeed`);
      }
    });
  });
  
  console.log(`\n=== OVERLAP WITH DAILYSEED ===`);
  if (overlaps.length > 0) {
    console.log(`OVERLAPS (${overlaps.length}):`);
    overlaps.forEach(o => console.log(`  - ${o}`));
  } else {
    console.log(`No overlap with existing dailySeed!`);
  }
  return overlaps;
}

const batchDir = __dirname;
const batchFiles = fs.readdirSync(batchDir)
  .filter(f => f.match(/^batch/) && f.match(/\.(ts|js)$/))
  .sort()
  .map(f => path.join(batchDir, f));

if (batchFiles.length === 0) {
  console.log('No batch files found! Create batch1.ts, batch2.ts, etc.');
  process.exit(0);
}

const results = batchFiles.map(validateBatchFile);
checkCrossBatchDuplicates(results);
checkAgainstExisting(results);

const totalAll = results.reduce((s, r) => s + r.total, 0);
const totalIssues = results.reduce((s, r) => s + r.issues.length, 0);
console.log(`\n=== GRAND TOTAL ===`);
console.log(`Words: ${totalAll} | Issues: ${totalIssues}`);