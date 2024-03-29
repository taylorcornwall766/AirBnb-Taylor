// backend/routes/api/session.js
const express = require("express");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];
router.post("/", validateLogin,async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  await setTokenCookie(res, user);
  let userJSON = user.toJSON()
  delete userJSON.createdAt
  delete userJSON.updatedAt
  return res.json({
    user: userJSON,
  });
});
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});
router.get('/', restoreUser, (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user
        });
      } else return res.json({ user: null });
    }
  );

module.exports = router;
