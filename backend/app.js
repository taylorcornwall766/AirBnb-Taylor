const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// sequelize Errors
const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

// adding the router
const routes = require('./routes')

const app = express();
// logs information about requests and responses
app.use(morgan('dev'))

// parses cookie
app.use(cookieParser())
// parses json bodies of requests with ct app/json
app.use(express.json())

// securite middlewares
if(!isProduction){
    app.use(cors())
}
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
)

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)
// debugging showing the path
// connect all the routes
app.use(routes)
// catching unhandled requests
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
})
// processing sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
      let errors = {};
      for (let error of err.errors) {
        errors[error.path] = error.message;
      }
      err.title = 'Validation error';
      err.errors = errors;
    }
    next(err);
  });
// formatting our errors before sending them as a JSON res
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
  });
module.exports = app;
