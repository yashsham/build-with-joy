const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');

function download(fileUrl, destPath, callback) {
  const parsedUrl = url.parse(fileUrl);
  const protocol = parsedUrl.protocol === 'https:' ? https : http;
  
  protocol.get(fileUrl, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      download(response.headers.location, destPath, callback);
    } else if (response.statusCode === 200) {
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${destPath} successfully.`);
        if (callback) callback();
      });
    } else {
      console.error(`Failed to download ${destPath}: Status Code ${response.statusCode}`);
      if (callback) callback(new Error('Status ' + response.statusCode));
    }
  }).on('error', (err) => {
    console.error('Error:', err.message);
    if (callback) callback(err);
  });
}

// Read the drive items JSON
const items = JSON.parse(fs.readFileSync('d:\\hermosa\\scripts\\parsed_drive_items.json', 'utf8'));

// Create directory if not exists
const dir = 'd:\\hermosa\\public\\assets\\screenshots';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Download first 5 screenshots as a test
let idx = 0;
function downloadNext() {
  if (idx >= 5 || idx >= items.length) {
    console.log('All test downloads finished.');
    return;
  }
  const item = items[idx];
  const downloadUrl = `https://docs.google.com/uc?export=download&id=${item.id}`;
  const destPath = `${dir}\\${item.name}`;
  console.log(`Downloading index ${idx}: ${item.name} (${item.id})...`);
  download(downloadUrl, destPath, (err) => {
    idx++;
    downloadNext();
  });
}

downloadNext();
