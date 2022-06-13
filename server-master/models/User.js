const mongoose = require("mongoose");
// const (ObjectId) = mongoose.Schema.Types;
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
  
  },
  profileImage:{
    type:String,
  },
  
  lastName:{
    type: String,

  },
  userName:{
    type: String,
  
  },
  email: {
    type: String,
  
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  
  
  followers:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
  
  following:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],


});
module.exports = User = mongoose.model("users", UserSchema);