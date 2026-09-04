import mongoose from "mongoose";

// ── Allowed cylinder sizes ─────────────────────────────────────────────────
export const CYLINDER_SIZES = ["5kg", "9kg", "18kg", "45kg", "90kg"];

const cylinderSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    sizeKg: {
      type: String,
      enum: {
        values: CYLINDER_SIZES,
        message: "Size must be one of: 5kg, 9kg, 18kg, 45kg, 90kg",
      },
      required: [true, "Cylinder size is required"],
    },
    gasType: {
      type: String,
      required: [true, "Gas type is required"],
      trim: true,
      // e.g. "LPG", "CNG"
    },
    capacityLitres: {
      type: Number,
      min: [0, "Capacity cannot be negative"],
      default: null,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: stock status
cylinderSchema.virtual("stockStatus").get(function () {
  if (this.availableQuantity === 0) return "out_of_stock";
  if (this.availableQuantity <= 5) return "low_stock";
  return "available";
});

// Prevent duplicate same size+gasType per shop
cylinderSchema.index({ shopId: 1, sizeKg: 1, gasType: 1 }, { unique: true });

const Cylinder = mongoose.model("Cylinder", cylinderSchema);
export default Cylinder;
