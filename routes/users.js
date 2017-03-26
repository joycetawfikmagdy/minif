var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Work = require('../models/work');
var fs = require('fs');
var sess;

var mongoosePaginate = require('mongoose-paginate');
var Gridfs = require('gridfs-stream');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer');
var mongo = require('mongodb');
var handlebars=require('handlebars');
var mongoose = require('mongoose');
// Register
router.get('/register', function(req, res){
	res.render('register');
});

//home home is only for logged in users
router.get('/home',  ensureAuthenticated,function(req, res){
  res.render('home');
});

var storage =multer.diskStorage({destination:function(req,file,cb){
    cb(null,'./arf')
},filename:function(req,file,cb){
    cb(null,file.originalname)
}});
var upload=multer({storage:storage});

router.post('/home', function(req, res){
  res.redirect('/');
  });



//portfoliopage
router.get('/portfolio',function(req, res){
  res.render('portfolio');
});

var cpUpload = upload.fields([{ name: 'img', maxCount: 1 }, { name: 'file', maxCount: 1}]);
router.post('/portfolio',cpUpload, function(req, res){
  var username = sess.username;
  var name = req.body.name;
  var link = req.body.link;





    req.checkBody('name', 'name is required').notEmpty();
  
     var errors = req.validationErrors();
     if(errors){
    res.render('portfolio',{
      errors:errors
    });
  } 


  else {
    
     var newWork;
   
      if (!req.files.img) {  

       if (!req.files.file) {

       
    req.checkBody('invisible1', 'Cannot create Work without any works').notEmpty();
  
     var errors = req.validationErrors();
     if(errors){
    res.render('portfolio',{
      errors:errors
    });
  } 



       }


       else{


   var file=req.files.file[0].originalname;
    
    newWork = new Work({
     
      
     username: username,
     
    file:file,
      name:name,
      
      link:link});
    Work.createWork(sess.username,newWork, function(err, user){
      if(err) throw err;
      console.log(user);
    });
     


    req.flash('success_msg', 'You Habe uploaded ur portfolio');

    res.redirect('home');

       }



      }  else{

          if (!req.files.file) {

        var img=req.files.img[0].originalname;
       newWork = new Work({
     
      
     username: username,
     img:img,
    
      name:name,
      
      link:link
      




    });
Work.createWork(sess.username,newWork, function(err, user){
      if(err) throw err;
      console.log(user);
    });
     


    req.flash('success_msg', 'You Habe uploaded ur portfolio');

    res.redirect('home');







     }



          else{

            var img=req.files.img[0].originalname;

            var file=req.files.file[0].originalname;

         newWork = new Work({
     
      
     username: username,
     file:file,
     img:img,
      name:name,
      
      link:link
      

    });


Work.createWork(sess.username,newWork, function(err, user){
      if(err) throw err;
      console.log(user);
    });
     


    req.flash('success_msg', 'You Habe uploaded ur portfolio');

    res.redirect('home');



     }



          }


    
} 
  
  });









// Guset page
router.get('/guest', function(req, res){
  res.render('guest');
});








function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}
// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Login
router.post('/register', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var invisible =req.body.invisible;
    req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

  
     User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(user){
      console.log("plzzzzzzz");
      req.checkBody('invisible', 'Duplicate').notEmpty();
      var errors = req.validationErrors();
     if(errors){
    res.render('register',{
      errors:errors
    });
  }
    }else {

     var errors = req.validationErrors();
     if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    
    var newUser = new User({
      
      username: username,
      password: password,

     

    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });
     sess=req.session;
     sess.username=req.body.username;


    req.flash('success_msg', 'You are registered and can now login');

    res.redirect('login');
} 










    }





  });

    




     
	});

//




passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/login',
  passport.authenticate('local', {successRedirect:'home', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
   
     res.send('Hello ' + JSON.stringify(req.session));
      sess=req.session;
     sess.username=req.body.username;
    res.redirect('/');
    

});
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});


router.get('/works', function(req, res){
  Work.find().sort({username: 'asc'}).exec(function(err, works){
 if(err){
            console.log('error..');
            return handleError(err);
        }
        else {
          
            console.log(works);

           res.render( "works", {works});

          
        }



    });



});



module.exports = router;



