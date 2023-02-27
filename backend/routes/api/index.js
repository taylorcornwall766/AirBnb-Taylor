const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const reviewsRouter = require('./reviews.js')
const spotImageRouter = require('./spotImages.js')
const reviewImageRouter = require('./reviewImages.js')
const bookingsRouter = require('./bookings.js')
const { restoreUser } = require("../../utils/auth.js");


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use('/bookings', bookingsRouter)
router.use('/session', sessionRouter);
router.use('/spot-images', spotImageRouter)
router.use('/review-images', reviewImageRouter)
router.use('/users', usersRouter);
router.use('/spots', spotsRouter)
router.use('/reviews', reviewsRouter)
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
