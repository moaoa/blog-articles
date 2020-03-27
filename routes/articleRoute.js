const express = require("express");
const app = express();
const Route = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

Route.get("/", (req, res) => {
  res.send("articles route");
});

Route.get("/new", async (req, res) => {
  const users = await User.find();
  res.render("new", { bayload: { article: new Article(), users } });
});
Route.get("/edit/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate("user")
    .exec();
  res.render("edit", { bayload: { article, isAuth: true } });
});

Route.get("/:slug", async (req, res) => {
  let article;
  let isAtuh = false;
  try {
    article = await Article.findOne({ slug: req.params.slug })
      .populate("user")
      .exec();

    if (req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.KEY, (err, decoded) => {
        if (err) throw err;
        isAtuh = article.user.id == decoded.id;
      });
    }
    res.render("show", { bayload: { article, isAtuh } });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});
Route.post("/", async (req, res) => {
  let article = new Article();
  let users = await User.find();
  // const userName = await User.findById(req.body.user).name;
  setVAlues(article, req.body);
  article.user = req.body.user;
  article.populate("user").exec();
  try {
    await article.save();
    res.render("show", { bayload: { article } });
  } catch (error) {
    if (error) res.render("new", { bayload: { article, users } });
    console.log(error);
  }
});
Route.delete("/:slug", async (req, res) => {
  await Article.findOneAndDelete({ slug: req.params.slug });
  res.redirect("/");
});
Route.put("/:slug", async (req, res) => {
  const article = await await Article.findOne({ slug: req.params.slug });
  setVAlues(article, req.body);
  try {
    await article.save();

    res.render("show", { bayload: { article, isAtuh: true } });
  } catch (error) {
    if (error) console.log(error);
  }
});
function setVAlues(obj, { title, description, markdown }) {
  obj.title = title;
  obj.description = description;
  obj.markdown = markdown;
}
module.exports = Route;
