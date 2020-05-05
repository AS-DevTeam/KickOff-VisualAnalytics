var express = require('express');
var router = express.Router();

var c = require('../controllers/reader.js');
var playerSkillsName = c.contents;

// GET player page
router.get('/', function(req, res, next) {
    res.render('index', { skillNames: playerSkillsName });
});

// GET teams page
router.get('/teams', function(req, res, next) {
    res.render('team-view');
});

module.exports = router;