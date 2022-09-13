const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');

// route middleware
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;