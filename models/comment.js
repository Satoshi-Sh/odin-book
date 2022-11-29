const mongoose = require("mongoose");
const { DateTime } =require("luxon")

const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    post: {type:Schema.Types.ObjectId, ref:"Post",required:true},
    text: {type:String, required:true,min_length:1,maxLength:500},
    user: {type:Schema.Types.ObjectId, ref:"User",required:true},
},{timestamps:true,toJSON:{virtuals:true}})

CommentSchema.virtual("date_formatted").get(function(){
    var d = new Date()
    return this.createdAt? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) + ' ' +DateTime.fromJSDate(this.createdAt).toFormat('h:mm a')  :'';
})


// Export model 
module.exports = mongoose.model("Comment",CommentSchema)