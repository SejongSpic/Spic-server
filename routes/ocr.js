/*Define dependencies.*/

var express=require("express");
var path    = require("path");
var multer = require('multer');
var http = require('http');
var util = require('util');
var fs = require('fs');
var tesseract = require('node-tesseract');

var upload_path = "/var/www/uploads"; // uplaod file storage path

// Configuration 
var router = express.Router();

/* Set up storage */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });  

router.post('/', upload.single('myfile'), function (req, res, next) {
});

// POST - 안드로이드로부터 이미지 받음
router.post('/upload', upload.single('myfile'), function (req, res, next) {
  //res.send('req : '+req.get('uuid'));
  //res.status(200).json({ message: 'success' });
  
  console.log('The file was saved !');
  console.log('req.file : '+req.file); // form fields

  tesseract.process(req.file.path, function(err, text) {
      if(err) {
          console.error(err);
      } else {
          console.log(text);
          //res.send(text);
          res.render('uploaded', {
            title : 'OCR 테스트',
            result : text,
            image_path : 'http://ec2-54-199-201-110.ap-northeast-1.compute.amazonaws.com/uploads/'+req.file.originalname
          });
      }
  });
})

module.exports = router;
