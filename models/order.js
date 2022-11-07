const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      address: {
        line1: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        pincode: {
          type: String,
          required: true
        }
      },
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
    instructions: {
      type: String
    },
    tracking_id: {
      type: String
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher'
    },
    paymentId: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
