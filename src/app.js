const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const compression = require('compression');
const { expressjwt } = require('express-jwt');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
//const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { ApiError } = require('./utils/ApiError');
const { jwt } = require('./config/config');
const path = require('path');
const { cacheMiddleware } = require('./middlewares/cache');
const { swaggerDocument } = require('./docs/docs');
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
//app.disable('etag');
// jwt authentication
app.use(passport.initialize());
//passport.use('jwt', jwtStrategy);
app.use(cacheMiddleware);
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
/* app.use(
  expressjwt({
    algorithms: ['HS256'],
    secret: config.jwt.secret,
    getToken: (req) => req.headers.token,
  })
); */
// v1 api routes
app.use('/static', express.static(path.join(__dirname, '../data')));
app.use('/v1', routes);
// livestream api docs
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Livestream',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(options);
app.use(
  '/livestream-api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      validatorUrl: null,
    },
    isExplorer: true,
    
  })
);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
