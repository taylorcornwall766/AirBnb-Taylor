const router = require('express').Router();

// test route to verify it works:
// url http://localhost:8000/api/test
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });





module.exports = router;
