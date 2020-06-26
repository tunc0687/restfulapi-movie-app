const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routers import
const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const directorsRouter = require('./routes/directors');

const app = express();

// DB Connection
const db = require("./helper/db")();

// Config
const config = require("./config");
app.set("api_secret_key", config.api_secret_key);

// Middleware
const verifyToken = require("./middleware/verify-token");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routerlar
app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', moviesRouter);
app.use('/api/directors', directorsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err.message});
});

module.exports = app;
