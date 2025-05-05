import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    guard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // guards are users
      required: true,
    },
    site: {
      type: String, // e.g., "123 Main Street, Delhi"
      required: true,
    },
    startDate: {
      type: Date, // e.g., 2025-05-05
      required: true,
    },
    endDate: {
      type: Date, // e.g., 2025-05-15
      required: true,
    },
    startTime: {
      type: Date, // e.g., 9:00 AM
      required: true,
    },
    endTime: {
      type: Date, // e.g., 6:00 PM
      required: true,
    },
    task: {
      type: String,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // admins are users too
      required: true,
    },
  },
  { timestamps: true }
);

const shiftModel = mongoose.model("shift", shiftSchema);

export default shiftModel;
