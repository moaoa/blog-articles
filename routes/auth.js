const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Article = require("../models/Article");

Route.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user == null) return res.sendStatus(401);
  bcrypt.compare(password, user.password, async (err, isMatched) => {
    if (err) throw err;
    if (!isMatched) res.status(403).json({ msg: "invalid credintials" });
    const articles = await Article.find();
    const token = jwt.sign({ id: user.id }, process.env.KEY);
    res.cookie("token", token);
    res.render("index", { bayload: { user: user, articles: articles, token } });
  });
});

module.exports = Route;
