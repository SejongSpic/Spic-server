/*Define dependencies.*/

var express=require("express");
var path    = require("path");
var multer = require('multer');
var http = require('http');
var util = require('util');
var fs = require('fs');
var tesseractOCR = require('node-tesseract');
var abbyyOCR = require('../lib/abbyy/test');
var async = require('async');

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

router.post('/best/upload', upload.single('myfile'), function (req, res, next) {
  console.log('Abbyy OCR Start');

  async.parallel([
    function(callback) {
      // do something
      abbyyOCR.process(req.file.path, req.file.originalname, callback);
    }
  ], function(err, results) {
    if(err) {
        console.error("Error : "+err);
        res.status(404).json({ message : 'fail', result : 'null' });
    } else {
      res.status(200).json({ message : 'success', result : results[0] });
    }
  });
});

// POST - 안드로이드로부터 이미지 받음
router.post('/mem/upload', upload.single('myfile'), function (req, res, next) {
  console.log('Mem OCR Start');

  tesseractOCR.process(req.file.path, function(err, text) {
      if(err) {
          console.error(err);
          res.status(404).json({ message : 'fail', result : null });
      } else {
        console.log(text);
        var len = text.trim().length;

        if(len == 0)
          text = 'null';
        
        res.status(200).json({ message : 'success', result : text });
      }
  });
})

module.exports = router;
