var mongoose = require('mongoose');

mongoose.connect('mongodb://Adil:123@ds117730.mlab.com:17730/fitness-app'); 

var userSchema = mongoose.Schema({
  fname: String, 
  username: String, 
  password: String, 
  time: {type: Date, default: new Date()},
  bmi: Array, 
  calorie: Array,
});  

module.exports = mongoose.model('user', userSchema); 