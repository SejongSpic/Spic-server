/*Define dependencies.*/

var express=require("express");
var path    = require("path");
var multer = require('multer');
var http = require('http');
var util = require('util');
var fs = require('fs');
var tesseract = require('node-tesseract');
var abbyyOCR = require('../lib/abbyy/test');
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

router.post('/mem/upload', upload.single('myfile'), function (req, res, next) {
  //res.send('req : '+req.get('uuid'));
  //res.status(200).json({ message: 'success' });
  console.log('Mem OCR Start');

  tesseract.process(req.file.path, function(err, text) {
      if(err) {
          console.error("Error : "+err);
      } else {
          console.log(text);
          var len = text.trim().length;
          
          if(len == 0)
            text = "판독 불가";

          res.render('uploaded', {
            title : 'OCR 테스트',
            result : text,
            image_path : 'http://ec2-54-199-201-110.ap-northeast-1.compute.amazonaws.com/uploads/'+req.file.originalname
          });
      }
  });
});

router.post('/best/upload', upload.single('myfile'), function (req, res, next) {
  console.log('Abbyy OCR Start');

  async.parallel([
    function(callback) {
      // do something
      abbyyOCR.process(req.file.path, req.file.originalname, callback);
    }
  ], function(err, results) {
    if(err){
      console.error("Error : "+err);
    }else{
      if(results[0] == null)
        results[0] = "판독 불가"

      res.render('uploaded', {
        title : 'OCR 테스트',
        result : results[0],
        image_path : 'http://ec2-54-199-201-110.ap-northeast-1.compute.amazonaws.com/uploads/'+req.file.originalname
      });
    }
  });
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
