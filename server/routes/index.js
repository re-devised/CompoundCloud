const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const config = require('config');
const db = require('../db/db');
const passport = require('passport')
const cors = require('cors');
const ip = require('ip')
const http = require('http')

const file = require('./file')
const cloud = require('./cloud')
const user = require('./user')
const diskspace = require('./diskspace')
const setting = require('./setting')


module.exports = function(app) { 

  app.use(express.json());
  app.use(require('body-parser').urlencoded({ extended: true }));


  const ipOrigin = process.env.BASE_URL || ('http://' + ip.address() + ":" + (process.env.PORT || '5000'))
  app.use(cors({
      origin: [ipOrigin, 'http://localhost:' + (process.env.PORT || '5000')]
  }));
  
  // http.createServer(function (req, res) { //Redirection server from port 80 to Port 443
  //     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  //     res.end();
  // }).listen(80);


  const store = db.initSessionStore();
  const sess =
    { 
      name: 'compound-session',
      secret: config.get('session_secret'),
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
      resave: true,
      saveUninitialized: false,
      store
    }
    
  // if (process.env.NODE_ENV == 'production') {
    // app.set('trust proxy', 1)
    // sess.cookie.secure = true;
    // sess.cookie.httpOnly = true;
    // sess.cookie.sameSite = false;
    //sess.cookie.domain = process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || '5000');
  // }
  
  app.use(cookieParser());
  app.use(session(sess));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/file', file.app)
  app.use('/cloud', cloud.app)
  app.use('/user', user.app)
  app.use('/diskspace', diskspace.app)
  app.use('/setting', setting.app)
  // app.use('/auth', auth)
  // app.use('/', home)
  // app.use(error)
}
