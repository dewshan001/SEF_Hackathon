import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    brand: {
      type: String,
      required: true, // e.g. 'Litro', 'Laugfs'
    },
    size: {
      type: String,
      enum: ["2.5kg", "5kg", "12.5kg", "37.5kg"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

stockSchema.virtual("isAvailable").get(function () {
  return this.quantity > 0;
});

stockSchema.index({ shopId: 1, brand: 1, size: 1 }, { unique: true });

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
