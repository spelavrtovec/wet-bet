/* jshint esversion: 6 */
require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const weather      = require("openweather-apis");

const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
const ensureLoggedIn = require("./middlewares/isloggedin");
    

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/big-data', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
});

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
      throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined ) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
});

// Enable authentication using session + passport
app.use(session({
  secret: 'Spela and Lars',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 18000000 }, //300 min of session
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  next();
});
/* res.locals i think changes the local session, or the cookies
    we check if there is a session, and if there is, it sets these "locals"
    to be accessed by the view 
    isUserLoggedIn: a boolean that indicates whether or not there is a logged in user
    currentUserInfo: the user’s information from the session (only available if logged in)
*/

app.use(flash());


app.use(flash()); //what is this?
    

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
      
const betRoutes = require('./routes/betting');
app.use('/betting', ensureLoggedIn("/"), betRoutes);








const wetRoutes = require('./routes/weather-api');
app.use('/wet', wetRoutes);


var makeMaxDate = function() {

  var dtToday = new Date();
  
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate() + 1;
  var year = dtToday.getFullYear();

  if (month < 10)
      month = '0' + month.toString();

  if (day < 10)
      day = '0' + day.toString();
  
  var maxDate = year + '-' + month + '-' + day;
  return maxDate;
};

let date = makeMaxDate();

weather.setLang("en");
// weather.setCity("Berlin")
weather.setCityId("2950159"); //Do we put the id of all the cities we are using here? Or none?
weather.setUnits("metric");

weather.setAPPID(process.env.WEATHER_KEY);

module.exports = app;