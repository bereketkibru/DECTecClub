const mongoose = require('mongoose')

const UserSchema =new  mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    uname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        required:true,
        default:'user'
    },
    department:{
        type: String

    },
    year:{
        type: String

    },
    phone:{
        type: String
    },
    likes:{
        type: String
    }

});
const User=mongoose.model('User', UserSchema);
 
 module.exports=User;