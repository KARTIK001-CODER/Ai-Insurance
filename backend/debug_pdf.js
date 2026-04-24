import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const fs = require('fs');

const uploads = fs.readdirSync('uploads');
const filePath = uploads.length > 0 ? `uploads/${uploads[0]}` : null;

async function test() {
  if (!filePath) return console.log('No file to test');
  const buffer = fs.readFileSync(filePath);
  const uint8 = new Uint8Array(buffer);
  
  try {
    console.log('Testing PDFParse getText() return value...');
    const instance = new pdfParseModule.PDFParse(uint8);
    const result = await instance.getText();
    console.log('Type of result:', typeof result);
    if (result && typeof result === 'object') {
      console.log('Result keys:', Object.keys(result));
    } else {
      console.log('Result value:', result);
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
