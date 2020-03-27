require("dotenv").config();
const express = require("express");
const app = express();
// routes
const articlesRoute = require("./routes/articleRoute");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
//models
const Article = require("./models/Article");
//pakeges
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => console.error("connection error"));
db.on("open", () => console.log("connected"));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.render("index", {
    bayload: {
      articles
    }
  });
});
// use routes
app.use("/articles", articlesRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoute);

// app.use(middleWare.notFound());
// app.use(middleWare.errorHandler());
app.listen(process.env.PORT || 5000);
