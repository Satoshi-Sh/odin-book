const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user')
const bcrypt = require("bcryptjs")

function passportInit(){
passport.use(
    new LocalStrategy((username,password,done)=>{
        User.findOne({username:username},(err,user)=>{
        if(err){
            return done(err)
        }
        if(!user){
            return done(null,false,{message:"Incorrect username"})
        }
        bcrypt.compare(password,user.password,(err1,res)=>{
            if (err1){
                return done(err1)
            }
            if(res){
              return done(null,user)
            }
            else {
              return done(null,false,{message:'Incorrect password'})
            }
          })
     })   
    })
)
passport.serializeUser(function(user,done){
    return   done(null,user.id)
   })
   
passport.deserializeUser(function(id,done){
       User.findById(id,function(err,user){
        return    done(err,user)
       })
   })


}



module.exports = passportInit;
