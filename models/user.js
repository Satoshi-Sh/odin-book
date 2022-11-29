const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type:String, required:true,maxLength:100,minLength:1,unique:true},
    password: {type:String, required:true, maxLength:100},
    profile: {type:String, mexLength:3000,default:''}},
    {timestamps:true,toJSON:{virtuals:true}}
)

// Virtual for user's URL 
UserSchema.virtual('url').get(function(){
    return `/user/${this._id}`
})
UserSchema.virtual('image').get(function(){
    const p =  path.join('public',`images`,`image_${this._id}.png`)
        console.log(p)
        if (fs.existsSync(p)){
            return `/images/image_${this._id}.png`
        }
        else{
            return '/images/user.png'}
        })

// Export model 

module.exports = mongoose.model("User",UserSchema)