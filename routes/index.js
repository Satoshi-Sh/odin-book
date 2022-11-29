var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController')

//multer setup 
var multer = require('multer');
var path = require('path')
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + req.user._id +'.png')
    }
});
  
var upload = multer({ storage: storage });


/* GET home page. */
router.get('/', postController.allposts)

router.post('/newpost',function(req,res,next){
  if(!req.user){
    res.redirect('/users/signup')
  }
  postController.newpost(req,res,next)
})

router.post('/post/:postId',function(req,res,next){
  if(!req.user){
    res.redirect('/users/signup')
  }
  postController.newcomment(req,res,next)
})


  

router.post('/logout',function(req,res,next){
   req.logout(function(err){
    if(err){
      return next(err)
    }
   })
   res.redirect('/')
})

router.get('/post/:postId',postController.postDetail)

router.get('/user/:userId',postController.userDetail)

router.get('/user/:userId/update',postController.getUpdate)
router.post('/user/:userId/update',postController.postUpdate)

router.post('/post/:postId/like',postController.postLike)
router.post('/post/:postId/dislike',postController.postDislike)

router.post('/user/:userId/follow',postController.postFollow)
router.post('/user/:userId/unfollow',postController.postUnfollow)


router.get('/feed',postController.feedposts)

router.get('/user/:userId/image', postController.getUploadImage)
router.post('/user/:userId/image',upload.single('image'),postController.postUploadImage)


module.exports = router;
