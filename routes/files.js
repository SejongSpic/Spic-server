/*Define dependencies.*/

var express=require("express");
var path    = require("path");
var multer = require('multer');
var http = require('http');
var util = require('util');
var fs = require('fs');
var tesseract = require('node-tesseract');
var abbyyOCR = require('../lib/abbyy/test.js');
var async = require('async');

var upload_path = "/var/www/uploads"; // uplaod file storage path

// Configuration 
var router = express.Router();
var app = express();

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

router.get('/upload', function(req, res, next){
  res.send("잘못된 경로입니다 !");
});

router.post('/best/upload', upload.single('myfile'), function (req, res, next) {
  //res.send('req : '+req.get('uuid'));
  //res.status(200).json({ message: 'success' });
  console.log('File upload test page - the file was saved !');
  console.log("Request file path : %s\nRequest file name : %s", req.file.path, req.file.originalname);

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
});

router.post('/mem/upload', upload.single('myfile'), function (req, res, next) {
  //res.send('req : '+req.get('uuid'));
  //res.status(200).json({ message: 'success' });
  console.log('File upload test page - the file was saved !');
  console.log("Request file path : %s\nRequest file name : %s", req.file.path, req.file.originalname);

  async.parallel([
    function(callback) {
      // do something
      abbyyOCR.process(req.file.path, req.file.originalname, callback);
    }
  ], function(err, results) {
    console.log("Result------\n"+results[0]);
    res.render('uploaded', {
      title : 'OCR 테스트',
      result : results[0],
      image_path : 'http://ec2-54-199-201-110.ap-northeast-1.compute.amazonaws.com/uploads/'+req.file.originalname
    });
  });
/*
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
*/
});

/* GET home page. */
router.get('/best', function(req, res, next) {
	res.sendFile(path.join(__dirname+'./../views/best_upload.html'));
});

/* GET home page. */
router.get('/mem', function(req, res, next) {
  res.sendFile(path.join(__dirname+'./../views/mem_upload.html'));
});

module.exports = router;
