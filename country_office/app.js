// Run the server with 'node app.js'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require('firebase-admin');
var app = express();

// Javascript library folder
// Makes the ./node_modules folder accessible in app
// as the path '/static'
app.use('/static', express.static('node_modules')); 

// Main app folder, makes the ./public folder accessible in app
// as the root folder (/)
app.use('/', express.static('public')); 

// TODO - move to separate js file
// Initialize Firebase
var serviceAccount = require("./Save-The-Children-f4df29163c17.json");

var config = {
  credential: firebase.credential.cert(serviceAccount),
//  apiKey: "AIzaSyCAHIw0DjNJ9U4oge0wNHhhNpZjNGTJkVQ", // TODO - move to heroku environment variables
//  authDomain: "save-the-children-b5ef0.firebaseapp.com",
  databaseURL: "https://save-the-children-b5ef0.firebaseio.com",
//  storageBucket: "save-the-children-b5ef0.appspot.com",
  messagingSenderId: "391660661794"
};
firebase.initializeApp(config);

var db = firebase.database();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

// Includes the routes for the app
// MUST BE AFTER ALL OPTIONS ARE SET
require('./routes/routes.js')(app,firebase,db);

var port = process.env.PORT || 8080; 

// startup our app at http://localhost:5000
app.listen(port);               
                   
console.log('Server running on port ' + port);

module.exports = app;
