import CustomError from "../utils/customError.js";
import { OTPMessage, sendMail } from "../utils/sendMail.js";
import userModel from "./user_model.js";
import sha256 from 'crypto-js/sha256.js';

//Signup for guard
export const singUpForGuard = async (req, res) => {
    const { name, email, mobile, address, password } = req.body;

    const avatar = req.file.filename;

    if (!avatar || !name || !email || !mobile || !address || !password) {
        throw new CustomError("Please provide all fields", 400);
    }
    if (password.length < 8) {
        throw new CustomError("Password must be at least 8 characters long", 400);
    }
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        throw new CustomError("User already exists", 400);
    }

    const user = await userModel.create({
        avatar,
        name,
        email,
        mobile,
        address,
        password,
        role: "guard",
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: { user, token },
    })
}

//signup for client
export const singUpForClient = async (req, res) => {
    const { name, email, mobile, address, password } = req.body;

    const avatar = req.file.filename;

    if (!avatar || !name || !email || !mobile || !address || !password) {
        throw new CustomError("Please provide all fields", 400);
    }
    if (password.length < 8) {
        throw new CustomError("Password must be at least 8 characters long", 400);
    }
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        throw new CustomError("User already exists", 400);
    }

    const user = await userModel.create({
        avatar,
        name,
        email,
        mobile,
        address,
        password,
        role: "client",
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: { user, token },
    })
}


//signup for admin
export const singUpForAdmin = async (req, res) => {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
        throw new CustomError("Please provide all fields", 400);
    }
    if (password.length < 8) {
        throw new CustomError("Password must be at least 8 characters long", 400);
    }
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
        throw new CustomError("User already exists", 400);
    }

    const user = await userModel.create({
        name,
        email,
        address,
        password,
        role: "admin",
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: { user, token },
    })
}


//Signin
export const signIn = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError("Please provide email and password", 400);
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        throw new CustomError("Invalid email or password", 401);
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new CustomError("Invalid email or password", 401);
    }
    const token = user.getJWTToken();

    res.status(200).json({
        success: true,
        message: "User Logged In Successfully",
        data: { user, token },
    })

}


//Foget Password
//Send otp
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new CustomError("Please provide an email", 400);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    const otpExpiry = Date.now() + Number(process.env.OTP_EXPIRY_IN || 10 * 60 * 1000);


    user.otp = sha256(otp, "otp").toString();
    const name = user.name

    user.otpExpiry = otpExpiry;
    await user.save();

    // send mail
    await sendMail({
        email: user.email,
        subject: "Your OTP for password reset",
        message: OTPMessage({ name, otp }),
    });

    res.status(200).json({
        success: true,
        message: "OTP sent to email",
    });


};


//Verify OTP
export const verifyOtp = async (req, res) => {

    const { otp, email } = req.body;

    if (!otp) {
        throw new CustomError("Please provide OTP", 400);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    const hashedOtp = sha256(otp).toString();


    if (user.otp !== hashedOtp || user.otpExpiry < Date.now()) {
        throw new CustomError("Invalid or expired OTP", 400);
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isOtpVerified = true; // Optional flag
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });

};


//Reset Password
export const resetPassword = async (req, res) => {

    const { newPassword, email } = req.body;

    if (!newPassword) {
        throw new CustomError("Please provide a new password", 400);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    if (!user.isOtpVerified) {
        throw new CustomError("OTP not verified", 401);
    }

    // if (newPassword.length < 8) {
    //     return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    // }

    user.password = newPassword;
    user.isOtpVerified = false;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
};


//Get Guards Profile
export const guardsProfile = async (req, res) => {

    const guards = await userModel.find({ role: "guard" });

    if (!guards) {
        throw new CustomError("Guards not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Guards fetched successfully",
        data: { guards: guards },
    })

}
export const clientProfile = async (req, res) => {

    const client = await userModel.find({ role: "client" });

    if (!client) {
        throw new CustomError("Client not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Client fetched successfully",
        data: { clients: client },
    })
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (user.role === "admin") {
        throw new CustomError("Admin can't be deleted", 400);
    }
    if (!user) {
        throw new CustomError("Guard not found", 404);
    }
    await userModel.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    })
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, address } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (address !== undefined) user.address = address;


    await user.save();
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: { user: user },
    })
}