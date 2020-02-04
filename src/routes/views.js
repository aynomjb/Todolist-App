const express = require('express');
const router = express.Router();

// IMPORT CONTROLLERS
const ViewController = require('../controllers/ViewController');


router.get('/',ViewController.homeView);
module.exports = router;