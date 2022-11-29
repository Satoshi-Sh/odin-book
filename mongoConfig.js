require('dotenv').config()

const mongoose = require("mongoose");

function initializeMongoServer(){
let mongoDB = ''
if (process.env.KEY){
  mongoDB =process.env.KEY
}
else {
  mongoDB = process.env.url
}

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology:true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
}


module.exports = initializeMongoServer;
