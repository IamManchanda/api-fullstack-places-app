const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limit: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuidv1()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
    let hasError = isValid ? null : new Error("Invalid file type");
    cb(hasError, isValid);
  },
});

module.exports = fileUpload;
