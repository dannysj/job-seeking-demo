const path = require('path');
const app = require('express').Router();
const sharp = require('sharp');
const multer = require('multer');
const image_compression_size = require("../config").image_compression_size;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../static/files');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

const storage_name_perserved = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../static/files');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});
const upload_name_perserved = multer({storage: storage_name_perserved});


app.post('/api/file/general_upload', upload.single('file'), (req, res) => {
  if (!req.file)
    return res.json({code: -21, errMsg: 'No files found'});

  compressImage(req.file);

  res.json({code: 0, url: '/files/' + req.file.filename});
});

const compressImage = (file) => {
  // All file types supported by `sharp`
  const imageMIME = ["image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp", "image/tiff"];
  if (imageMIME.indexOf(file.mimetype) !== -1) {

    const fileExtension = path.extname(file.filename);
    const fileBaseName = path.basename(file.filename, fileExtension);
    const newFileName = fileBaseName + "_small" + fileExtension;

    sharp(file.path)
      .resize(image_compression_size)
      .toFile(path.join(file.destination, newFileName));

    file.filename = newFileName;
  }
}

app.post('/api/file/general_upload_name_perserved', upload_name_perserved.single('file'), (req, res) => {
  if (!req.file)
    return res.json({code: -21, errMsg: 'No files found'});

  res.json({code: 0, url: '/files/' + req.file.filename});
});


module.exports = app;
