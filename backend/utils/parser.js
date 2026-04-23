import { createRequire } from 'module';
import fs from 'fs/promises';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');


export const parseDocument = async (filePath, mimeType) => {
  const fileBuffer = await fs.readFile(filePath);
  
  if (mimeType === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text;
  }
  
  if (mimeType === 'application/json') {
    const jsonStr = fileBuffer.toString('utf-8');
    const jsonObj = JSON.parse(jsonStr);
    return JSON.stringify(jsonObj, null, 2);
  }
  
  if (mimeType === 'text/plain') {
    return fileBuffer.toString('utf-8');
  }
  
  throw new Error('Unsupported file type');
};
