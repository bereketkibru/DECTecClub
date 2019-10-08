const express= require('express');
const router=express.Router();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const bcrypt=require('bcryptjs');
const passport=require('passport');
const { ensureAuthenticated } = require('../config/auth');

//post model
const Post=require('../models/bPost')
//uesr model
const User=require('../models/User')
//announcement model
const Announcement=require('../models/ann')
//message model
const Message=require('../models/messsage')


//wellcome page
router.get('/',(req,res)=> res.render('welcome'));
//dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res){
if(req.user.role==="admin"){
  us=req.user;
  Post.find({}, function(err, posts){
    res.render('dashboard', {
      posts: posts,
      us:us
 });
});
  }else{
  res.render("404")
  }
});



//login page
router.get('/login',(req,res)=> res.render('login'));

//register page
router.get('/register',(req,res)=> res.render('register'));

//Register Handle
router.post('/register', (req,res) => {
   const {fname,lname,uname, email, password, password2}=req.body;
   let errors=[];
   //check required fields
   if(!fname || !lname ||!uname ||!email || !password || !password2){
       errors.push({msg: 'Please fill in all fields'});
   }
   //check passwords mathc
   if(password !==password2){
       errors.push({msg: 'Password do not match'});
   }
   // check pass length
   if(password.length<6){
       errors.push({msg:'Password should be at least 6 characters'})
   }
   if(errors.length>0){
     res.render('register',{
        errors,
        fname,
        lname,
        uname,
        email,
        password,
        password2
     }); 
   } else {
    // validation pass
    
    User.findOne({$or:[{email:email},{uname,uname}]})
    .then(user=>{
        if(user){
            //user exist
            errors.push({msg: ' The name should be characters Email is already registerd User name should be unique'});
            res.render('register',{
                errors,
                fname,
                lname,
                uname,
                email,
                password,
                password2
            });     
        }         
        else{
            const newUser=new User({
                fname,
                lname,
                uname, 
                email, 
                password
            });
           //hash password
           bcrypt.genSalt(10,(err,salt)=> 
             bcrypt.hash(newUser.password,salt,(err,hash)=>{
                 if(err) throw err;
                 //set password to hashed
                 newUser.password=hash;
                 //save user
                 newUser.save()
                 .then(user=>{
                     req.flash('success_msg', 'you are now registered and can log in');
                     res.redirect('/login');
                 })
                 .catch(err=>console.log(err))


           }));
        }
        
    });
    

   }
   
});

var us= [];
//login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });

//home page
router.get("/home", ensureAuthenticated, function(req, res){
  var us=req.user;
  Post.find({}, function(err, posts){
   res.render("home", {
     posts: posts,
     us:us
});
 });
});
//like
router.post("/home/:id", function(req,res){
  User.findById(req.params.id, function(err, theUser){
      if(err){
          console.log(err);
      } else {
          theUser.likes += 1;
          theUser.save();
          console.log(theUser.likes);
      }
  });
});

//announcement page
router.get("/announcement", ensureAuthenticated, function(req, res){
  Announcement.find({}, function(err, announcements){
   res.render("announcement", {
     announcements:announcements
});
 });
});
// abut us page
router.get("/about", ensureAuthenticated, function(req, res){
  res.render("about");
});
// contact  us page



router.get("/contact",ensureAuthenticated, function(req, res){
  User.find({}, function(err, usc){
    res.render("contact", {
      usc:usc
 });
  });
});
router.get("/uProfile/:xx", ensureAuthenticated, function(req, res){
  const requestedUser = req.params.xx;
  
  User.findOne({uname: requestedUser}, function(err, us){
    res.render("uProfile", {
    us:us
    });
  });
  
});
// profile page
router.get("/user", ensureAuthenticated, function(req, res){
  var us=req.user;
  res.render("user",{us:us});
});


  
router.post("/user", function(req, res){
 // console.log(req.body)
  User.updateOne({_id:req.user._id}, { department: req.body.department,year:req.body.gridRadios,phone: req.body.phone },function(err){
    if(err){
console.log(err);
    }else{
      res.redirect("user");
    }
  });
});
// chat
router.get("/chat", ensureAuthenticated, function(req, res){
  Message.find({}, function(err, foundItems){
    
        
          res.render("chat", { message: foundItems});
        
      });
});
router.post("/chat", function(req, res){
  
    const mbody = req.body.newItem;
    const by = req.user.uname;
    const message = new Message({
      mbody:mbody,
      by:by
    });  
      message.save();
      res.redirect("/chat");
    
  });
  router.get("/chatd", ensureAuthenticated, function(req, res){
    if(req.user.role==="admin"&&req.user.uname==="admin"){
      Message.find({}, function(err, foundItems){
        res.render("chatd", { message: foundItems});
    });
    }else{
    res.render("404")
    }
    
  });
  router.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
   
      Message.findByIdAndRemove(checkedItemId, function(err){
        
          res.redirect("/chatd");
        
      
  
      });
  
  
  });
//user management(update)
router.get("/update",ensureAuthenticated, function(req, res){
  
    if(req.user.role==="admin"&&req.user.uname==="admin"){
      res.render("update");
    }else{
    res.render("404")
    }
    });

    router.post("/update", function(req, res){
      // console.log(req.body)
       User.updateOne({email:req.body.email}, { role:req.body.gridRadios},function(err){
         if(err){
     console.log(err);
         }else{
          
           res.redirect("update");
         }
       });
     });
//compose post page

router.get("/compose",ensureAuthenticated, function(req, res){

  if(req.user.role==="admin"){
    res.render("compose");
  }else{
  res.render("404")
  }
  });
  router.post("/compose", function(req, res){
    
    const post = new Post ({
     title: req.body.postTitle,
     content: req.body.postBody,
     imag: req.body.imag,
     pBy:req.user.uname
   });
   post.save()
   .then(user=>{
    res.redirect('home');
})
.catch(err=>console.log(err))

  });

  //compose announcement page

router.get("/comann",ensureAuthenticated, function(req, res){
 if(req.user.role==="admin"){
  res.render("comann");
  }else{
    res.render("404")
  }
});
router.post("/comann", function(req, res){
  const announcement = new Announcement ({
   atitle: req.body.annTitle,
   acontent: req.body.annBody,
   duDate:req.body.aduDate
 });
 announcement.save()
 .then(user=>{
  res.redirect('announcement');
})
.catch(err=>console.log(err))
 

});
  //posts
  router.get("/posts/:postId", ensureAuthenticated,function(req, res){
    
    const requestedPostId = req.params.postId;
    
    Post.findOne({_id: requestedPostId}, function(err, post){
      
         res.render("post", {
      
           title: post.title,
      
           content: post.content
      
         });
      
       });

    });
    
  

module.exports=router;