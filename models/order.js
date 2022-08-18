const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["placed", "dispatched", "delivered"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
