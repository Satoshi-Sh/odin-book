var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var passport= require("passport")

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup',{title:'Register Account'});
});

router.post('/signup',userController.post_signup)

router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{
  session:true,
  failureRedirect:"/users/login",
  failureFlash:true,
}),
function(req,res){
res.redirect('/')
}
)


module.exports = router;
