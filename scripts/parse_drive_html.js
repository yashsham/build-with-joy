const fs = require('fs');

const file = 'C:\\Users\\boybl\\.gemini\\antigravity\\brain\\10cb1ad6-d13e-4f2a-97f4-7db5bc9ac58c\\.system_generated\\steps\\918\\content.md';
const content = fs.readFileSync(file, 'utf8');

console.log('Searching for image filenames...');
const regex = /[^"'\/\\#]*\.(png|jpg|jpeg|gif|webp|mp4|mov|cif|pdb)/gi;
const matches = content.match(regex) || [];

console.log('Total matches found:', matches.length);
const uniqueMatches = Array.from(new Set(matches.map(m => m.trim()))).filter(m => m.length > 2 && m.length < 100);
console.log('Unique file matches:');
console.log(uniqueMatches);

// Let's search for drive JSON data
console.log('\nSearching for Google Drive file metadata block...');
const initDataRegex = /window\['ytInitialData'\]|window\['bootstrap'\]|window\['INITIAL_DATA'\]|initData/gi;
let match;
while ((match = initDataRegex.exec(content)) !== null) {
  console.log(`Found init data keyword at index: ${match.index}`);
  console.log(content.substring(match.index, match.index + 200));
}
