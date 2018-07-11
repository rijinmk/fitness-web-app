var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('./models/user'); 
var cookieSession = require('cookie-session'); 
var mongoose = require('mongoose');

var app = express(); 

// mongodb://<dbuser>:<dbpassword>@ds117730.mlab.com:17730/fitness-app

passport.serializeUser(function(user, done){
  console.log("........Serialize........");
  done(null, user._id); 
}); 

passport.deserializeUser(function(id, done){
  console.log("........Deserialize........");
  User.findById(id, function(err, data){
    if(!err){
      done(null, data); 
    }
  }); 
}); 

app.set('view engine', 'ejs');
app.use(cookieSession({maxAge: 24*60*60*1000, keys: ['asdsrgwr']})); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended: true}));      

app.get('/', function(req, res){
  res.redirect('/login'); 
});

app.get('/login', function(req, res){
  if(req.user){
    console.log('logged in as' + req.user.username);
    res.redirect('/profile/'+req.user.username);  
  }
  res.render('index'); 
});

app.get('/register', function(req, res){
  if(req.user){
    console.log('logged in as' + req.user.username);
    res.redirect('/profile/'+req.user.username);  
  }
  res.render('register'); 
});

app.post('/register', function(req, res){
  console.log(req.body.register); 
  
  var userObj = {
    fname: req.body.register.fname, 
    username: req.body.register.username, 
    password: req.body.register.password, 
    bmi: [], 
    calories: [],
  }
  
  User.create(userObj, function(err, data){
    if(!err){
      console.log(data);
      req.login(data, function(){
        if(!err){
          res.redirect('/profile/' + data.username); 
        }else{
          res.redirect('/register'); 
        }
      });
    }else{
      console.log(err); 
    }
  });
}); 

app.get('/profile/:username', function(req, res){
  if(req.user){
    if(req.user.username === req.params.username){
      res.render('profile', {data: req.user});
    }else{
      res.send('User not available'); 
    }
  }else{
    res.redirect('/');
  }
});

app.post('/cal', function(req, res){
  console.log(req.body.cal); 
  console.log(req.user); 
  req.user.calorie.push(req.body); 
  console.log(req.user); 
  User.findOneAndUpdate({username: req.user.username}, req.user, function(err, data){
    if(!err){
      console.log(data);
      res.send(data); 
    }
  }); 
}); 

app.post('/bmi', function(req, res){
  console.log(req.body.bmi); 
  console.log(req.user); 
  req.user.bmi.push(req.body); 
  console.log(req.user); 
  User.findOneAndUpdate({username: req.user.username}, req.user, function(err, data){
    if(!err){
      console.log(data); 
      res.send(data);
    }
  }); 
}); 

app.get('/history', function(req, res){
  User.find({username: req.user.username}, function(err, data){
    res.send(data); 
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/'); 
});

app.post('/login', function(req, res){
  console.log(req.body.login); 
  User.findOne({username: req.body.login.username}, function(err, data){
    if(!err){
      if(data){
        console.log(data); 
        req.login(data, function(err){
          if(!err){
            res.redirect('/profile/'+data.username); 
          }
        });
      }
    }else{
      console.log(err); 
    }
  }); 
});

app.listen(process.env.PORT || 3001, function(){
  console.log('Listeing to PORT'); 
}); 