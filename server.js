var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var connect = require('connect');
var session = require('express-session');
var hbs = require('handlebars');
var handlebars=require('handlebars');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoosePaginate = require('mongoose-paginate');
var mongoose = require('mongoose');
var DB_URI = 'mongodb://localhost:27017/portfolio';

mongoose.connect(DB_URI);
var db = mongoose.connection;

//hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination);
/*hbs.registerHelper('pagination', function(currentPage, totalPage, size, options) {
  var startPage, endPage, context;

  if (arguments.length == 3) {
    options = size;
    size = 5;
  }

  startPage = currentPage - Math.floor(size / 2);
  endPage = currentPage + Math.floor(size / 2);

  if (startPage <= 0) {
    endPage -= (startPage - 1);
    startPage = 1;
  }

  if (endPage > totalPage) {
    endPage = totalPage;
    if (endPage - size + 1 > 0) {
      startPage = endPage - size + 1;
    } else {
      startPage = 1;
    }
  }

  context = {
    startFromFirstPage: false,
    pages: [],
    endAtLastPage: false,
  };
  if (startPage === 1) {
    context.startFromFirstPage = true;
  }
  for (var i = startPage; i <= endPage; i++) {
    context.pages.push({
      page: i,
      isCurrent: i === currentPage,
    });
  }
  if (endPage === totalPage) {
    context.endAtLastPage = true;
  }

  return options.fn(context);
});




/*registerHelper("ifl", function(value, options)
{
    if(value > '2') {
    return 0;
  }
  return 1;
});*/


db.on('error', function(){console.log("error")});
db.once('open', function() {
  // we're connected! 
  console.log("3aaaaaaaaa")
});




var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();







// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session

/*var store = new MongoDBStore(
      {
        uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
        collection: 'mySessions'
      });

store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
app.use(require('express-session')({
      secret: 'This is a secret',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
      },
      store: store,
      // Boilerplate options, see: 
      // * https://www.npmjs.com/package/express-session#resave 
      // * https://www.npmjs.com/package/express-session#saveuninitialized 
      resave: true,
      saveUninitialized: true
    }));*/

app.use(session({secret: 'This is a secret',resave: true,
      saveUninitialized: true,
      cookie: {expires: new Date(253402300000000)}
}));




// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());



// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);


app.use(express.static(__dirname+ '/arf'));



app.listen(8080, function(){
    console.log("server is listening on port ")});
    