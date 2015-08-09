/*Define dependencies.*/

var express=require("express");
var path    = require("path");
var multer = require('multer');
var http = require('http');
var util = require('util');
var fs = require('fs');

var upload_path = "/var/www/uploads";

// Configuration 
var router = express.Router();
var app = express();

// Set up storage 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'_'+file.originalname);
  }
});

var upload = multer({ storage: storage }); 

router.get('/upload', function(req, res, next){
  res.send("Error");
});

router.post('/upload', upload.single('myfile'), function (req, res, next) {
  console.log('The file was saved !');
  console.log(req.file); // form fields

  res.redirect('http://ec2-54-199-201-110.ap-northeast-1.compute.amazonaws.com/uploads/');
})

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname+'./../views/upload.html'));
});

module.exports = router;
