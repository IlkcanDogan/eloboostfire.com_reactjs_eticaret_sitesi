var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/config', function(req, res, next) {
  res.send({
    'social' : {
      'instagram': 'eloboostfire',
      'discord': 'https://discord.com/eloboostfire'
    }
  })
})

module.exports = router;