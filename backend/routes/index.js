const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter)
// go to this url to get that XSRF
// token for your fetch request:
// http://localhost:8000/api/csrf/restore
router.get('/api/csrf/restore', (req, res)=>{
   const csrfToken = req.csrfToken()
   res.cookie('XSRF-TOKEN', csrfToken);
   res.status(200).json({
    'XSRF-Token': csrfToken
   })
})

module.exports = router;
