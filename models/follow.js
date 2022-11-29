const mongoose = require("mongoose");
const { DateTime } =require("luxon")

const Schema = mongoose.Schema;


const FollowSchema = new Schema({
    f1: {type:Schema.Types.ObjectId, ref:"User",required:true},
    f2: {type:Schema.Types.ObjectId, ref:"User",required:true}
},{toJSON:{virtuals:true}})



// Export model 
module.exports = mongoose.model("Follow",FollowSchema)