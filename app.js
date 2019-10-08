const express = require('express');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const path=require('path');

const app =express();

app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Passport Config
require('./config/passport')(passport);
//DB config
const db=require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('MongoDB connected....'))
.catch(err=> console.log(err));



//express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  // Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//routes
app.use('/',require('./routes/index'));
//app.use('/users',require('./routes/users'));
app.use(function(req,res){
  res.status(404).render('404.ejs');
});
const PORT= process.env.PORT || 3000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
