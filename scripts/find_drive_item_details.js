const fs = require('fs');

const file = 'C:\\Users\\boybl\\.gemini\\antigravity\\brain\\10cb1ad6-d13e-4f2a-97f4-7db5bc9ac58c\\.system_generated\\steps\\918\\content.md';
const content = fs.readFileSync(file, 'utf8');

// List of filenames we saw:
const samples = [
  'Screenshot_20260609-201713_Chrome.jpg',
  'WhatsApp Image 2026-06-09 at 19.03.00.jpeg'
];

samples.forEach(name => {
  console.log(`\n--- Context for: ${name} ---`);
  let idx = content.indexOf(name);
  if (idx !== -1) {
    // Print 300 characters before and after
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + name.length + 150);
    console.log(content.substring(start, end));
  } else {
    console.log('Not found!');
  }
});
