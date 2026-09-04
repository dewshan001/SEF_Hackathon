import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    cylinder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cylinder",
      required: true,
    },
    cylinderSize: { type: String, required: true },
    gasType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    capacityLitres: { type: Number, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: {
        values: ["pending", "ready", "collected", "cancelled"],
        message: "Invalid status",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
