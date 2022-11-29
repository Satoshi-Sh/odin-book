var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var imageSchema = new mongoose.Schema({
	user: {type:Schema.Types.ObjectId, ref:"User",required:true,unique:true},
	desc: {type:String,default:'profile'},
	img:
	{
		data: Buffer,
		contentType: String
	}
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
