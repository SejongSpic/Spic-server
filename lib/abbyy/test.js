// Demo sample using ABBYY Cloud OCR SDK from Node.js

var shell = require('shelljs');

var print = function(name)
{
	return name;
}

var process = function (image_path, image_name, callback){
/*
	if (typeof process == 'undefined' || process.argv[0] != "node") {
		throw new Error("This code must be run on server side under NodeJS");
	}
*/
	// To create an application and obtain a password,
	// register at http://cloud.ocrsdk.com/Account/Register
	// More info on getting your application id and password at
	// http://ocrsdk.com/documentation/faq/#faq3

	// Name of application you created
	var appId = 'samsung_ocr_education_sdk';
	// Password should be sent to your e-mail after application was created
	var password = 'LIDYh4dLTWTVxL57PGG1N4vD';

	var imagePath = image_path;
	var outputPath = '/var/www/results/'+image_name+'.txt';

	try {
		console.log("REQUEST : \nImage path : %s\nOutput path : %s", imagePath, outputPath);
		//console.log("ABBYY Cloud OCR SDK Sample for Node.js");

		var ocrsdkModule = require('./ocrsdk.js');
		var ocrsdk = ocrsdkModule.create(appId, password);
		ocrsdk.serverUrl = "http://cloud.ocrsdk.com"; // change to https for secure connection

		if (appId.length == 0 || password.length == 0) {
			throw new Error("Please provide your application id and password!");
		}
		
		if( imagePath == 'myFile.jpg') {
			throw new Error( "Please provide path to your image!")
		}

		function downloadCompleted(error) {
			if (error) {
				console.log("Error: " + error.message);
				return;
			}
			console.log("Done.");
			resultToString();
		}

		function processingCompleted(error, taskData) {
			if (error) {
				console.log("Error: " + error.message);
				return;
			}

			if (taskData.status != 'Completed') {
				console.log("Error processing the task.");
				if (taskData.error) {
					console.log("Message: " + taskData.error);
				}
				return;
			}

			console.log("Processing completed.");
			console.log("Downloading result to " + outputPath);

			ocrsdk
					.downloadResult(taskData.resultUrl.toString(), outputPath,
							downloadCompleted);

		}

		function uploadCompleted(error, taskData) {
			if (error) {
				console.log("Error: " + error.message);
				return;
			}

			console.log("Upload completed.");
			console.log("Task id = " + taskData.id + ", status is " + taskData.status);
			if (!ocrsdk.isTaskActive(taskData)) {
				console.log("Unexpected task status " + taskData.status);
				return;
			}

			ocrsdk.waitForCompletion(taskData.id, processingCompleted);
		}

		var settings = new ocrsdkModule.ProcessingSettings();
		// Set your own recognition language and output format here
		settings.language = "English"; // Can be comma-separated list, e.g. "German,French".
		settings.exportFormat = "txt"; // All possible values are listed in 'exportFormat' parameter description 
	                                   // at http://ocrsdk.com/documentation/apireference/processImage/

		console.log("Uploading image..");
		ocrsdk.processImage(imagePath, settings, uploadCompleted);

		function resultToString()
		{
			var resultStr = shell.cat(outputPath);
			var len = resultStr.trim().length;

		    if(len == 0)
		    	resultStr = 'null';
		    else
		    	resultStr = resultStr.toLowerCase();

			console.log("Result : \n"+resultStr);
		    console.log("Result Trim length : "+len);

			callback(null, resultStr);
		}

	} catch (err) {
		console.log("Error: " + err.message);
	}

	//console.log shell.cat(outputPath);
}
//var str = shell.cat('/var/www/results/4.jpg.txt');
//console.log(str);
//abbyOCR("/var/www/uploads/4.jpg", "4.jpg");

module.exports.process = process;
module.exports.print = print;
