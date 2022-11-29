require('dotenv').config()
const User = require("../models/user");



const { body, validationResult } = require("express-validator")
const passport = require("passport");
const bcrypt = require('bcryptjs')


exports.post_signup =[
    body("username").trim().isLength(
        {min:1, max:30}
    ).escape()
    .withMessage("Username must be between 1 and 30"),
    body('password').trim().isLength({min:5})
    .withMessage("Password must be at leat 5 letters long"),
    body('confirmation').custom((value, {req})=>{

        if(value!==req.body.password){
            throw new Error("Password confirmation does not match password")
        }
        return true;
    }),

    (req,res,next)=>{
        bcrypt.genSalt(10,function(err1,salt){
        bcrypt.hash(req.body.password,salt,(err,hashedpassword)=>{
        if (err){
            return next(err)
        } 
        const user = new User({
            username: req.body.username,
            password: hashedpassword
        })
    
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.render("signup",{
            title:'Sign up',
            useri:user,
            errors:errors.array()  
        })
        return;
    }
    
    user.save(err=>{
        if(err){
            return next(err);
        }
        req.login(user,function(err){
            if(err){return next(err)}
            
            return res.redirect('/')
        })
})

})
        })
    }
]

