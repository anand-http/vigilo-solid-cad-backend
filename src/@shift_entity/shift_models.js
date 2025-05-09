import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    guard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date, 
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date, 
      required: true,
    },
    endTime: {
      type: Date, 
      required: true,
    },
    task: {
      type: String,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const shiftModel = mongoose.model("shift", shiftSchema);

export default shiftModel;
