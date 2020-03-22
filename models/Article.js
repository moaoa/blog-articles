const mongoose = require("mongoose");
const slugify = require("slugify");
const marked = require("marked");
const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  markdown: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

Schema.pre("validate", function() {
  if (this.title) {
    this.slug = slugify(this.title, { strict: true, lower: true });
  }
  if (this.markdown) this.markdown = marked(this.markdown);
});

module.exports = mongoose.model("Ariticle", Schema);
