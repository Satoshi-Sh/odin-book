const User =require("../models/user")
const Post = require("../models/post")
const Comment= require("../models/comment")
const Follow = require("../models/follow")
const Image = require("../models/image")
const async = require("async");
var path = require('path');
var fs = require('fs');





exports.allposts = (req,res,next)=>{
        if (!req.user){
          res.redirect('/users/signup')
        }
        Post.find({},)
        .sort({createdAt:1})
        .populate('user')
        .exec(function(err,posts){
            if(err||!posts){
                return next(err)
            }
            if (posts.length>0){
            posts.map(item=>{
                item.title= item.title.replace('&#x27;',"'")
                item.text = item.text.replace('&#x27;',"'")
                item.user.username = item.user.username.replace('&#x27;',"'")

                return item
            })
        }
            res.render('index',{title:'All Posts',user:req.user,posts})
        })
        
      
}
// show only followed users posts
exports.feedposts = (req,res,next)=>{
  if (!req.user){
    res.redirect('/users/signup')
  }
  Follow.find({f1:req.user._id},(err1,follows)=>{
     let users = []
     if (err1){
      next(err1)
     }
     for (follow of follows){
      users.push(follow.f2)}
      
     Post.find({user:{$in:users}})
      .populate('user')
      .sort({createdAt:1})
      .exec(function(err,posts){
      if (err){
        next(err)
      }
      if (posts.length>0){
             posts.map(item=>{
                 item.title= item.title.replace('&#x27;',"'")
                 item.text = item.text.replace('&#x27;',"'")
                 item.user.username = item.user.username.replace('&#x27;',"'")
                 return item
             })
            }
      res.render('feed',{title:'Feed Posts',user:req.user,posts})
      
  })
  })
}




exports.newpost = (req,res,next) =>{
        
        post = new Post({
          title:req.body.title,
          user:req.user,
          text:req.body.text,
        }).save((err)=>{
          if(err){
            return next(err)
          }
          res.redirect('/')
      })
    }

exports.newcomment= (req,res,next)=>{
    comment = new Comment({
      post:req.params.postId,
      text:req.body.text,
      user:req.user
    }).save((err)=>{
      if(err){
        return next(err)
      }
    })
    res.redirect(`/post/${req.params.postId}`);
}

exports.postDetail = (req,res,next)=>{
   async.parallel(
    {
      post(callback){
      Post.findById(req.params.postId)
       .populate('user')
       .populate('likes')
       .exec(callback)
    },
    
      comments(callback){
        Comment.find({post:req.params.postId})
        .populate('user')
        .exec(callback)
      }
    },(err,results) =>{
    if(err){
      return next(err)
    }
    if (results.post==null){
      const err = new Error("Post not found")
      err.status=404;
      return next(err)
    }
   let liked=false
   for (let u of results.post.likes)
     {
      if (u.username==req.user.username){
      liked=true
     }
    }
   console.log(liked)
   res.render('postdetail',{title:'Post Detail',post:results.post,comments:results.comments,user:req.user,liked}) 
   })
  }

exports.userDetail = (req,res,next)=>{
  async.parallel(
    {
      userdetail(callback){
        User.findById(req.params.userId)
        .exec(callback)
      },
      posts(callback){
        Post.find({user:req.params.userId})
        .sort({createdAd:1})
        .populate('user')
        .exec(callback)
      },
      isFollow(callback){
        Follow.find({f1:req.user._id,f2:req.params.userId})
        .exec(callback)
      },
      image(callback){
        Image.find({user:req.params.userId})
        .exec(callback)
      }
    },
    (err,results)=>{
      if (err){
        next(err)
      }
      let isYou=false

      if (req.user?._id==req.params.userId)
      { isYou=true}
      
      let isFollow = false
      if (results.isFollow.length>0){
        isFollow=true
      }

      res.render('user',{title:'User Detail',user:req.user,userdetail:results.userdetail,posts:results.posts,isYou,isFollow,image:results.image})
    }
  )
   
  }

  exports.getUpdate = (req,res,next) =>{
    if (req.user){
      res.render('userupdate',{title:'User Update',user:req.user})
    }
    else{
    res.redirect('/')
    }
  }

  exports.postUpdate = (req,res,next) =>{
    if (req.user){
      User.findByIdAndUpdate(req.user._id,{profile:req.body.profile},
        (err,user)=>{
          if(err){
            next(err)
          }
          else{
            res.redirect(`/user/${user._id}`)
          }
        })
    }
    else{
    res.redirect('/')
    }
  }

  exports.postLike = function(req,res,next){
    if (req.user){
      Post.findByIdAndUpdate(req.params.postId,
        {$push:{likes:req.user}},
        {safe: true, upsert: true},
        function (err,post){
          if(err){
            next(err)
          }
          res.redirect(`/post/${req.params.postId}`)
        })
    }
    else{
    res.redirect('/')
    }
  }

  exports.postDislike = function(req,res,next){
    if (req.user){
      Post.findByIdAndUpdate(req.params.postId,
        {$pull:{likes:req.user._id}},
        {safe: true, upsert: true},
        function (err,post){
          if(err){
            next(err)
          }
          res.redirect(`/post/${req.params.postId}`)
        })
    }
    else{
    res.redirect('/')
    }
  }


  exports.postFollow = function(req,res,next){
    if (req.user){
      const follow = new Follow({
        f1:req.user._id,
        f2: req.params.userId
      }).save((err,f)=>{
          if (err){
            next(err)
          }
          res.redirect(`/user/${req.params.userId}`)
        })
    }
    else{
    res.redirect('/')
    }
  }

  exports.postUnfollow = function(req,res,next){
    if (req.user){
      Follow.findOneAndRemove({f1:req.user._id,f2:req.params.userId},(err,follow)=>{
        if(err|!follow){
          next(err)
        }
        res.redirect(`/user/${req.params.userId}`)
      })
    }
    else{
    res.redirect('/')
    }
  }

  exports.getUploadImage = function(req,res,next){
    if (req.user){
       res.render('image',{title:'Upload Image',user:req.user})
    }
    else {
      res.redirect('/')
    }
  }

  exports.postUploadImage = function(req,res,next){
    if (!req.user){
      res.redirect('/')
    }
    const image = new Image({
      user:req.user,
      img: {
        data:fs.readFileSync(path.join('public' + '/images/'+req.file.filename)),
        contentType:'image/png'
      }
    }).save((err,item)=>{
      if(err){
        next(err)
      }
      res.redirect(`/user/${req.user._id}`)
    })
  }

  

  
  