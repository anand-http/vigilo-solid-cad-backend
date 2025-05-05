import CustomError from "../utils/customError.js";
import { OTPMessage, sendMail } from "../utils/sendMail.js";
import userModel from "./user_model.js";
import sha256 from 'crypto-js/sha256.js';

//Signup for guard
export const singUpForGuard = async (req, res) => {
    try {
        const { name, email, mobile, address, password } = req.body;

        if (!name || !email || !mobile || !address || !password) {
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

    } catch (error) {

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        })

    }
}

//signup for client
export const singUpForClient = async (req, res) => {
    try {
        const { name, email, mobile, address, password } = req.body;

        if (!name || !email || !mobile || !address || !password) {
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

    } catch (error) {

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        })

    }
}

//signup for admin
export const singUpForAdmin = async (req, res) => {
    try {
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

    } catch (error) {

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        })

    }
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

        user.otpExpiry = otpExpiry;
        await user.save();

        // send mail
        await sendMail({
            email: user.email,
            subject: "Your OTP for password reset",
            message: OTPMessage(user.name, otp),
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to email",
        });

    
};


//Verify OTP
export const verifyOtp = async (req, res) => {

    const { otp } = req.body;

    if (!otp) {
        throw new CustomError("Please provide OTP", 400);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    const hashedOtp = sha256(otp).toString();

    console.log("verify", hashedOtp);

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
    
        const { newPassword } = req.body;

        if (!newPassword) {
            throw new CustomError("Please provide a new password", 400);
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new CustomError("User not found", 404);
        }

        if (!user.isOtpVerified) {
            return res.status(401).json({ success: false, message: "OTP not verified" });
        }

        // if (newPassword.length < 8) {
        //     return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        // }

        user.password = newPassword;
        user.isOtpVerified = false;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
};

