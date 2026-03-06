import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const logosDir = path.join(__dirname, 'uploads', 'logos');

// Ensure directory exists
if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, logosDir);
    },
    filename: (req, file, cb) => {
        cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG and WEBP images are allowed"), false);
    }
};

export const logoUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 2 } // 2MB limit
});
