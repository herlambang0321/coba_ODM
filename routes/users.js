var express = require('express');
var router = express.Router();
const User = require('../models/user')
const { Response, generateToken, isLoggedIn, signout } = require('../helpers/util')

router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    const users = await User.find().populate('todos')
    res.json(new Response(users))
  } catch (error) {
    res.status(500).json(new Response(error, false))
  }
});

router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body)
    res.status(201).json(new Response(user))
  } catch (error) {
    res.status(500).json(new Response(error, false))
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(201).json(new Response(user))
  } catch (error) {
    res.status(500).json(new Response(error, false))
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id })
    res.status(200).json(new Response(user))
  } catch (error) {
    res.status(500).json(new Response(error, false))
  }
});

router.post('/auth', async function (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    // check email exist
    if (!user) throw { message: 'email is wrong', code: 401 }
    // check password exist
    if (!user.validPassword(password)) throw { message: 'password is wrong', code: 401 }
    // generate token
    user.token = generateToken({ userid: user._id, email: user.email })
    user.save()
    res.status(201).json(new Response({ email: user.email, name: user.name, token: user.token }))
  } catch (error) {
    console.log(error);
    res.status(error.code ? error.code : 500).json(new Response(error.message ? error.message : error, false))
  }
});

router.post('/signout', signout);

module.exports = router;
