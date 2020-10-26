const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Load User model
const User = require('./models/User');
const {forwardAuthenticated , ensureAuthenticated} = require('./config/auth');

require('./config/passport')(passport);

//connect to mongoDB
const DBURI = "mongodb+srv://Sahil:XXXXXXXXXX@cluster0.3zl0l.mongodb.net/Todo";
mongoose.connect(DBURI, { useNewUrlParser: true , useUnifiedTopology: true })
.then( (res) =>{ 
        console.log('connected to db'),
        app.listen(3000,() => console.log('server is started!'));
})
.catch( (err) => console.log(err));

// register a view engine
app.set('view engine', 'ejs');

// changing location of views
//app.set('views', 'myviews');

app.use(express.static(path.join(__dirname, 'public')));

// Body-parser middleware 
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:false})) 

// Express session
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

// Connect to flash
app.use(flash());

// Global Variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.get('/login',forwardAuthenticated, (req,res) => {
    res.render('login');
});

app.get('/register',forwardAuthenticated, (req,res) => {
    res.render('register');
});

app.post('/register',(req,res) => {
    const { name, email, password, password2 } = req.body;
    console.log(req.body);
    // if taking data directly from req.body then use name as defined in forms.
    // if taking data indivisually like var x = req.body.name, then no need for same name
    //console.log(req.body);
  let errors = [];

  if (!name || !email || !password || !password2) {
      if(!name)console.log('name');
      if(!email)console.log('email');
      if(!password)console.log('password');
      if(!password2)console.log('password2');
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
      // Vlaidation Passed.
      User.findOne({email: email}).then(user => {
        if(user) {
          errors.push({ msg: 'Email already exist' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        }
        else {
          const newUser = new User ({
            name,
            email,
            password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt , (err, hash) => {
              if(err) throw err;
              newUser.password = hash ;
              newUser.save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
});


// Login 
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res ,next);
});

// Logout 
app.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

app.get('/', ensureAuthenticated ,(req,res) => {
    res.render('todo',{
      name: req.user.name,
      list: req.user.tasks
    });
});

app.post('/add', ensureAuthenticated ,(req, res) => {
    let t1 = req.body.input1;
    let t2 = false;
    req.user.tasks.push({t1,t2});
    console.log(req.body);
    req.user.update( { $push : { tasks:{ data:t1,check:t2}}})
      .then(user =>{
        res.redirect('/');
      })
      .catch(err => console.log(err));
})

//app.listen(3000,() => console.log('server is started!'));

