const mongoose = require('mongoose')
const MessageSchema =new  mongoose.Schema({
    mbody: String,
    by: String,
    date:{
      type: Date,
      default: Date.now
  }
   });
   const Message = mongoose.model('Message', MessageSchema);
 module.exports=Message;