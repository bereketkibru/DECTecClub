const mongoose = require('mongoose')
const PostSchema =new  mongoose.Schema({
    title: String,
    content: String,
    imag: String,
    like: String,
    date:{
      type: Date,
      default: Date.now
  },
  pBy:String
   });
   const Post = mongoose.model('Post', PostSchema);
 module.exports=Post;