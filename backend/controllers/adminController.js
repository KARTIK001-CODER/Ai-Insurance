import { parseDocument } from '../utils/parser.js';
import fs from 'fs/promises';

export const uploadPolicy = async (req, res) => {
  try {
    const { policyName, insurer } = req.body;
    
    if (!policyName || !insurer) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'policyName and insurer are required fields.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Policy document file is required.'
      });
    }

    const { path: filePath, mimetype: mimeType } = req.file;

    const extractedText = await parseDocument(filePath, mimeType);
    const previewText = extractedText.substring(0, 500);

    return res.status(200).json({
      success: true,
      policyName,
      insurer,
      fileType: mimeType,
      extractedText: previewText
    });

  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({
      success: false,
      message: 'Failed to parse the document or process the request.'
    });
  }
};
