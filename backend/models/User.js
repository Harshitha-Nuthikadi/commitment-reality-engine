import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    realityScore: { type: Number, default: 100 },
    biasType: {
      type: String,
      enum: ["OPTIMISTIC", "REALISTIC", "FEARFUL"],
      default: "REALISTIC"
    },
    currentPhase: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
