import { createRequire } from 'module';
import fs from 'fs/promises';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.PDFParse || (typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default);




export const parseDocument = async (filePath, mimeType) => {
  const fileBuffer = await fs.readFile(filePath);
  
  if (mimeType === 'application/pdf') {
    try {
      // Try as a class constructor (v2.4.5+)
      const instance = new pdfParse(new Uint8Array(fileBuffer));
      const result = await instance.getText();
      return typeof result === 'string' ? result : (result?.text || "");
    } catch (err) {
      // Fallback to regular function call (older versions)
      try {
        const result = await pdfParse(fileBuffer);
        return typeof result === 'string' ? result : (result?.text || "");
      } catch (err2) {
        throw new Error("Failed to parse PDF: " + err2.message);
      }
    }
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
