const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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
// connect all the routes
app.use(routes)



module.exports = app;
