const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  variant: [
    {
      name: {
        type: String,
        default: "Default",
      },
      imageUrls: [
        {
          type: String,
        },
      ],
      mrp: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["STOCK", "ORDER"],
      },
      stock: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Product", ProductSchema);
