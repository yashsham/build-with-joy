const fs = require('fs');

const file = 'C:\\Users\\boybl\\.gemini\\antigravity\\brain\\10cb1ad6-d13e-4f2a-97f4-7db5bc9ac58c\\.system_generated\\steps\\918\\content.md';
const content = fs.readFileSync(file, 'utf8');

// We want to find elements that look like:
// aria-label="[filename] [anything]" ... ssk='5:[anything]:[id]-0-16'
// Or search for aria-label="[filename]" and grab the nearest ssk attribute.
console.log('Extracting filenames and IDs...');

const results = [];
// Find all aria-label="..." attributes
const ariaLabelRegex = /aria-label="([^"]+)"/g;
let match;
while ((match = ariaLabelRegex.exec(content)) !== null) {
  const label = match[1];
  // Check if this label contains a filename with extension
  if (/\.(jpg|jpeg|png|gif|webp|mp4|mov)/i.test(label)) {
    // Search forward and backward near this match for the ssk='...' attribute
    const index = match.index;
    const searchArea = content.substring(Math.max(0, index - 500), Math.min(content.length, index + 500));
    
    // Find ssk='5:...' or similar inside the search area
    const sskMatch = searchArea.match(/ssk='([^']+)'/);
    if (sskMatch) {
      const sskVal = sskMatch[1];
      // ssk has format like 5:auSv138:11cEN04Sqxwr9lsjlo8x-D5Ymmh9HNCtf-0-16
      const parts = sskVal.split(':');
      if (parts.length >= 3) {
        const idPart = parts[2]; // e.g. "11cEN04Sqxwr9lsjlo8x-D5Ymmh9HNCtf-0-16"
        // Strip the trailing "-0-16" or similar suffix
        const id = idPart.replace(/-0-\d+$/, '').replace(/-1-\d+$/, '');
        results.push({ name: label.replace(/ (Image Shared|Video Shared|File)/i, ''), id });
      }
    }
  }
}

console.log('Total files found:', results.length);
const uniqueResults = Array.from(new Set(results.map(r => JSON.stringify(r)))).map(s => JSON.parse(s));
console.log('Unique files found:', uniqueResults.length);
fs.writeFileSync('d:\\hermosa\\scripts\\parsed_drive_items.json', JSON.stringify(uniqueResults, null, 2));

uniqueResults.forEach((item, i) => {
  console.log(`${i+1}: ${item.name} -> ID: ${item.id}`);
});
