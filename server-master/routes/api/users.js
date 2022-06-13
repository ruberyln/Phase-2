const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  // const { errors, isValid } = validateRegisterInput(req.body);
  // // Check validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          firstName: user.firstName,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              _id: user._id,
              followers: user.followers,
              following: user.following,
              success: true,
              token: "Bearer " + token,
              firstName: user.firstName,
            });
          }
        );
      } else {
        return res.status(400).json({ error: "Password incorrect" });
      }
    });
  });
});


router.post('/follow', async (req, res) => {
  await User.findByIdAndUpdate(req.body.followId, {
    $addToSet: { followers: req.body.userId }
  }, {
    new: true
  })
  let result = await User.findByIdAndUpdate(req.body.userId, {
    $addToSet: { following: req.body.followId }
  }, { new: true })
  return res.status(200).json(result)
});

router.post('/unfollow', async(req, res) => {

  await User.findByIdAndUpdate(req.body.followId, {
    $pull: { followers: req.body.userId }
  }, {
    new: true
  })
  let result = await User.findByIdAndUpdate(req.body.userId, {
    $pull: { following: req.body.followId }
  }, { new: true })
  return res.status(200).json(result)
});


router.put('/updateUser', async (req, res) => {
  let { userId, ...data } = req.body
  let result = await User.findByIdAndUpdate(userId,
    data, { new: true }
  )

  return res.status(200).json(result);
});

router.post('/followers', async (req, res) => {
  let body = req.body
  let user = await User.findOne({
    _id: body.userId
  })
  let result = await User.find({
    _id: {
      $in: user.followers
    }
  })
  return res.status(200).json(result);
});


router.post('/following', async (req, res) => {
  let body = req.body
  let user = await User.findOne({
    _id: body.userId
  })

  let result = await User.find({
    _id: {
      $in: user.following
    }
  })

  return res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  let data = req.body
  let user = await User.findOne({
    _id: req.params.id
  })
  return res.status(200).json(user);
});
router.post('/suggestions', async (req, res) => {
  let body = req.body
  let user = await User.findOne({
    _id: body.userId
  })
  let result = await User.find({
    _id: {
      $nin: [...user.following,user._id]
    }
  })

  return res.status(200).json(result);
});
module.exports = router;
