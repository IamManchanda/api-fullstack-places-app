const multer = require("multer");
const uuid = require("uuid/v1");

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limit: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, `${uuid()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
    let hasError = isValid ? null : new Error("Invalid file type");
    cb(hasError, isValid);
  },
});

module.exports = fileUpload;
