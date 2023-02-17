const router = require('express').Router();

// test route to verify it works:
// url http://localhost:8000/api/test
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  // console.log("/1/1//1/1/1/1/1/1/1/1")
  const user = await User.findOne({
      where: {
        username: 'Demo-lition'
      }
    });
  setTokenCookie(res, user);
  return res.json({ user: user });
});




module.exports = router;
