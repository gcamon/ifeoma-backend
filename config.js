'use strict';

var pathExp = require("path");
var multer = require('multer');

var bodyParser = require('body-parser');

module.exports = function(app) {

	//app.use('/assets',express.static(__dirname + '/public'));
	
	app.use(bodyParser.urlencoded({ extended: true,limit: '50mb'}));
	
	app.use(bodyParser.json({limit: '50mb'}));


	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './videos')
	  },
	  filename: function (req, file, cb) {
	    cb(null, Date.now() + pathExp.extname(file.originalname)) 
	  }
	});

	var upload = multer({ storage: storage });
	app.use(upload.any());
	
}