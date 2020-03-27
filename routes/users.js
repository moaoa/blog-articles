const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @route GET /users/new
// @desc  render user's new page
// @access public
Route.get("/new", (req, res) => {
  res.render("users/new", { user: new User() });
});

// @route GET /users/login
// @desc  render login page
// @access public
Route.get("/login", (req, res) => {
  res.render("users/login", { user: new User() });
});

// @route POST /users
// @desc register a user
// @access public
Route.post("/", async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email)
    return res.status(400).json({ msg: "please enter all fileds" });
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "email already exists" });
  user = new User({
    name,
    password,
    email
  });

  await user.save();
  jwt.sign({ id: user.id }, "secret", (err, token) => {
    if (err) throw err;
    res.json({
      user: {
        name: user.name,
        id: user.id,
        email: user.email,
        password: user.password,
        token
      }
    });
  });
});

module.exports = Route;
