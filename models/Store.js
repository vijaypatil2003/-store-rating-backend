const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      maxlength: 400,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Store", storeSchema);
