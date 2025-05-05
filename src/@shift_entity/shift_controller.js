import userModel from "../@user_entity/user_model.js";
import shiftModel from "./shift_models.js"
import CustomError from "../utils/customError.js";
import { sendMail } from "../utils/sendMail.js";


export const shiftAllotment = async (req, res) => {
    const { guardId, site, startDate, endDate, startTime, endTime, task, notifyVia } = req.body;
    console.log(guardId)
    const guard = await userModel.findById(guardId);

    if (!guard) {
        throw new CustomError("Guard not found", 404);
    }

    if (!guardId || !site || !startTime || !endTime | !startDate || !endDate) {
        throw new CustomError("Missing required fields", 400);
    }

    const exists = await shiftModel.findOne({
        guard: guardId,
        site: site,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    });

    if (exists) {
        throw new CustomError("Duplicate shift: A similar shift already exists for this guard.", 409);
    }

    const newShift = new shiftModel({
        guard: guardId,
        site: site,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        task,
        assignedBy: "6818489f92c6284140446cb0",
    });

    await newShift.save();

    // Notification Message
    const message = `Hi ${guard.name}, you have a new shift from ${new Date(
        startTime
    ).toLocaleString()} to ${new Date(endTime).toLocaleString()} at ${site}.`;



    // Send notification based on the user's preference
    if (notifyVia === "email") {
        await sendMail({
            email: guard.email,
            subject: "New Shift Assigned",
            message: message,
        });
    } else if (notifyVia === "sms") {
        if (!guard.mobile) {
            throw new CustomError("Guard's phone number is not available", 400);
        }
        // await sendSMS(guard.phone, message);
    }

    res.status(201).json({
        message: "Guard assigned to shift successfully",
        data: { message, newShift }
    });
}