const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});
userSchema.pre("save", async function() {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
});
module.exports = mongoose.model("User", userSchema);
