const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", usersSchema);
