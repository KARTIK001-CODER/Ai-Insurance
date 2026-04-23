import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uploadPolicy, deletePolicy, queryPolicy, getAllPolicies, updatePolicy } from '../controllers/adminController.js';
import { basicAuth } from '../middleware/auth.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/json', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JSON, and TXT are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });
const router = express.Router();

router.use(basicAuth);

router.post('/upload-policy', (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadPolicy);

router.get('/policies', getAllPolicies);
router.put('/policy/:id', updatePolicy);
router.delete('/policy/:id', deletePolicy);
router.post('/query', queryPolicy);

export default router;
