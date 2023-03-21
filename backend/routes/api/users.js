// backend/routes/api/users.js
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      let oldUser = await User.findOne({where:{username:username}})
      let oldUser2 = await User.findOne({where:{email:email}})
      let errors = {}
      if(oldUser2){
        errors.email = "User with that email already exists"
      }
      if(oldUser){
        errors.username = "User with that username already exists"
      }
      console.log(errors)
      console.log(oldUser)
      console.log(oldUser2)
      if(Object.keys(errors).length){
        return res.status(403).json({
          "message": "User already exists",
          "statusCode": 403,
          "errors": errors
        })
      }
      const user = await User.signup({email, username, password, firstName, lastName });

      await setTokenCookie(res, user);
      let userJSON = user.toJSON()
      delete userJSON.createdAt
      delete userJSON.updatedAt
      return res.json(userJSON);
    }
  );

module.exports = router;
