const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    address: String,
    email: {
      required: true,
      type: String,
      unique: true,
    },
    img: String,
    type: {
      default: "user",
      type: String,
    },
    name: String,
    lastName: String,
    password: {
      required: true,
      type: String,
    },
    phone: String,
    role: {
      default: "user",
      type: String,
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);


userSchema.index({ email: 1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
