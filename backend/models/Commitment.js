import mongoose from "mongoose";

const commitmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    estimatedEffort: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    actualEffort: { type: Number },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING"
    },
    effortRatio: { type: Number },
    effortGap: { type: Number },
    pendingReason: { type: String },
    inaccurateNote: { type: String },
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date },
    phase: { type: Number, default: 1 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Commitment", commitmentSchema);
