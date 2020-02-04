
const cors = require('cors');
const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');

// IMPORT DB INSTANCE
const DB = require('./database/DB');

// IMPORT KEYS
const CONFIG = require('./config/keys');

// CONFIG AND RUN EXPRESS SERVER
app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.use(express.static('resources/views'));
app.set('views',__dirname + '/resources/views');
app.listen(8000,console.log(`Server is running on port 8000`));



//USE ROUTES
app.use('/',require('./routes/views'));
app.use('/api',require('./routes/apis'));