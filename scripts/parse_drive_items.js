const fs = require('fs');

const file = 'C:\\Users\\boybl\\.gemini\\antigravity\\brain\\10cb1ad6-d13e-4f2a-97f4-7db5bc9ac58c\\.system_generated\\steps\\918\\content.md';
const content = fs.readFileSync(file, 'utf8');

// The google drive INITIAL_DATA or initData contains JSON structure.
// Let's find the large JSON data in the script tags.
console.log('Extracting drive items from HTML...');

const regex = /AF_initDataCallback\(\{key: 'ds:1',[^]*?data:([^]*?)\}\);/g;
const match = regex.exec(content);

if (match) {
  try {
    // The data might have escaped quotes or javascript-specific objects.
    // Let's extract the array block.
    const rawData = match[1].trim();
    // Save it as a temp text file so we can inspect or write a parser
    fs.writeFileSync('d:\\hermosa\\scripts\\temp_raw_data.json', rawData);
    console.log('Raw data block saved to scripts/temp_raw_data.json. Size:', rawData.length);
  } catch (e) {
    console.error('Error parsing raw data:', e);
  }
} else {
  console.log('Could not find ds:1 initDataCallback data block.');
}

// Alternative way: search for drive IDs using a regex
// Google drive IDs are 33 characters (alphanumeric, underscores, hyphens) e.g., '1dfL594gFdyR_ZzwtvvUo8Yq4NpAtQkI6'
// Or 19-33 characters. Let's find strings like: ["ID", null, "Name", "mime-type"]
console.log('\nSearching for item entries via regex...');
const entryRegex = /\["([a-zA-Z0-9_-]{20,40})",\s*null,\s*"([^"]+)"/g;
let m;
const items = [];
while ((m = entryRegex.exec(content)) !== null) {
  items.push({ id: m[1], name: m[2] });
}

console.log('Unique entries found:', items.length);
const uniqueItems = Array.from(new Set(items.map(item => JSON.stringify(item)))).map(s => JSON.parse(s));
console.log('Total unique entries:', uniqueItems.length);
fs.writeFileSync('d:\\hermosa\\scripts\\drive_files.json', JSON.stringify(uniqueItems, null, 2));
console.log('Unique items metadata saved to scripts/drive_files.json.');

uniqueItems.forEach((item, i) => {
  console.log(`${i+1}: ${item.name} (${item.id})`);
});
