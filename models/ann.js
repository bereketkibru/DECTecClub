const mongoose = require('mongoose')
const AnnouncementSchema =new  mongoose.Schema({
    atitle: String,
    acontent: String,
    date:{
      type: Date,
      default: Date.now
  },
  duDate:{
    type:String
  }
   });
   const Announcement = mongoose.model('Announcement', AnnouncementSchema);
 module.exports=Announcement;