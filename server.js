const express = require("express");
const app = express();
const middleWare = require("./middleWare/middleWare");
const articlesRoute = require("./routes/articleRoute");
const Article = require("./models/Article");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => console.error("connection error"));
db.on("open", () => console.log("connected"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.render("index", { articles });
});

app.use("/articles", articlesRoute);

app.use(middleWare.notFound());
app.use(middleWare.errorHandler());
app.listen(process.env.PORT || 5000);
