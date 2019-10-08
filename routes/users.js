const express= require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//uesr model
const User=require('../models/User')


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
    User.findOne({email:email})
    .then(user=>{
        if(user){
            //user exist
            errors.push({msg: 'Email is already registerd'});
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
                     res.redirect('/users/login');
                 })
                 .catch(err=>console.log(err))


           }));
        }
        
    });
    

   }
   
});


//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
  
module.exports=router;