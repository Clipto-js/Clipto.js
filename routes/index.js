var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.render('index');
})

router.get('/signup', (req, res) => {
    res.render('signup');
})
router.get('/dashboard', (req, res) => {
    console.log(req.body);
    res.render('dashboard');
})
module.exports = router;