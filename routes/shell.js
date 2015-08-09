var tesseract = require('node-tesseract');

// Recognize text of any language in any format
module.exports.ocrprocess = function(path, cb){
	tesseract.process(path, function(err, text) {
	    if(err) {
	        console.error(err);
	        return cb(err, null);
	    } else {
	        console.log(text);
			return cb(null, text);
	    }
	});
};
// Recognize German text in a single uniform block of text and set the binary path
/*  
var options = {
    l: 'eng',
    psm: 6,
    binary: '/usr/bin/tesseract'
};
 
tesseract.process(__dirname + '/path/to/image.jpg', options, function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
require('shelljs/global');

var path = '/var/www/uploads/testimage/test.png';

// Run external tool synchronously 
if (exec('tesseract '+path+' /home/ubuntu/mem/output/output').code !== 0) {
  echo('Error: tesseract shell command execution failed');
  exit(1);
}

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}
 
// Copy files to release dir 

//cp('-R', 'stuff/*', 'out/Release');
 
// Replace macros in each .js file 
cd('lib');

ls('*.js').forEach(function(file) {
  sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
  sed('-i', /.*REMOVE_THIS_LINE.*\n/, '', file);
  sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, cat('macro.js'), file);
});
cd('..');
 
// Run external tool synchronously 
if (exec('git commit -am "Auto-commit"').code !== 0) {
  echo('Error: Git commit failed');
  exit(1);
}
*/