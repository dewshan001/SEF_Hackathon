import mongoose from "mongoose";

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
    cylinderDetails: {
      brand: { type: String, required: true },
      size: { type: String, required: true },
      quantityPurchased: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    deliveryAddress: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number],
      text: { type: String },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
