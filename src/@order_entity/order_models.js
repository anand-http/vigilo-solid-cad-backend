import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        images: {
            type: [String],
        },
        serviceType: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        serviceSite: {
            type: String,
            required: true,
        },
        noOfGuards: {
            type: Number,
            required: true,
        },
        description: {
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
    },
    { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
