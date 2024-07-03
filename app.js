const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session)
const morgan = require('morgan');
const winston = require('winston');

const fs = require('fs');

const HomeController = require('./controllers/HomeController');
const AdminController = require('./controllers/AdminController');
const SecurityController = require('./controllers/SecurityController');
const { APP_NAME, APP_DESCRIPTION, APP_VERSION, USERPROFILE_TYPE_ADMIN } = require('./config/consts');
const { directus_retrieve_user, core_retrieve_admin } = require('./config/global_functions');

const app = express();

// view engine setup
app.engine('ejs', require('express-ejs-extend'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secret_dev = "Cc7HYbzMLhZrGnqA54uBETy6mNUgvP"
const secret_prod = "Ba3wgQyXr5YP2CdSbzUAHt7ncxKsqp"
const age = 12 * 60 * 60 * 1000 // 48 hours
const modactuel = process.env.NODE_ENV || 'development'

if (modactuel == "development") {
  const client = redis.createClient()
  app.use(session({
    secret: secret_dev,
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: client,
      ttl: 260
    }),
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: age
    }
  }));
} else {
  app.use(session({
    secret: secret_prod,
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: age
    }
  }));
}


app.use(
  '/admin',
  async (req, res, next) => {
    console.log("__AdminController________________________________")
    let error = ""
    if (req.session.user_data) {
      let r_core_admin = await core_retrieve_admin(req.session.jwt_token, req.session.user_data)

      if (r_core_admin.success) {
        let user_data = r_core_admin.data.data

        if (user_data.profile.id == USERPROFILE_TYPE_ADMIN && user_data.status) {
          next()
        } else {
          error = "Vous n'êtes pas autorisé à accéder à cette page."
        }

      } else {
        error = r_core_admin.message
      }

    } else {
      error = "Votre session a expirée."
    }

    if (error) {
      // logger.error("Error while retrieving user data for admin: " + error)
      // logger.error("Redirecting to /security/logout, modactuel: " + modactuel)
      console.log("Error while retrieving user data for admin: " + error)
      res.redirect("/security/logout")
    }
  }, AdminController
)

app.use(
  '/',
  (req, res, next) => {
    console.log("__HomeController________________________________")
    next()
  }, HomeController
)

app.use(
  '/security',
  (req, res, next) => {
    console.log("__SecurityController______________________________")
    next()
  }, SecurityController
)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.render('security/notfound', {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    appDescription: APP_DESCRIPTION
  })
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
