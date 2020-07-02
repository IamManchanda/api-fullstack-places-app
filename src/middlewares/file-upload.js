const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v1: uuidv1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpeg",
};

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_KEY } = process.env;

aws.config.update({
  secretAccessKey: AWS_S3_SECRET_KEY,
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  region: "eu-west-1",
});

const s3 = new aws.S3();

const fileUpload = multer({
  limit: 500000,
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "assets-fullstack-mern-app",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "Testing Meta Data" });
    },
    key: function (req, file, cb) {
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
