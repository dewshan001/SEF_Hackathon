import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

shopSchema.index({ location: "2dsphere" });

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
