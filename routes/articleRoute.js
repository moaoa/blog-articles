const express = require("express");
const app = express();
const Route = express.Router();
const Article = require("../models/Article");

Route.get("/", (req, res) => {
  res.send("articles route");
});

Route.get("/new", (req, res) => {
  res.render("new", { article: new Article() });
});
Route.get("/edit/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  res.render("edit", { article });
});

Route.get("/:slug", async (req, res) => {
  let article;
  try {
    article = await Article.findOne({ slug: req.params.slug });
    res.render("show", { article });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});
Route.post("/", async (req, res) => {
  let article = new Article();
  setVAlues(article, req.body);
  try {
    await article.save();
    res.render("show", { article });
  } catch (error) {
    if (error) res.render("new", { article });
    console.log(error);
  }
});
Route.delete("/:slug", async (req, res) => {
  await Article.findOneAndDelete({ slug: req.params.slug });
  res.redirect("/");
});
Route.put("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  setVAlues(article, req.body);
  try {
    await article.save();
    res.render("show", { article });
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
