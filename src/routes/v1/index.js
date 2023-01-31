const express = require('express');
const router = express.Router();
const playerRoute = require('./player.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const courseRoute = require('./course.route');
const golfCourseRoute = require('./golf_course.route');
const authRoute = require('./auth.route');
const defaultRoutes = [
  {
    path: '/players',
    route: playerRoute,
  },
  {
    path: '/golfcourses',
    route: golfCourseRoute,
  },
  {
    path: '/courses',
    route: courseRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
