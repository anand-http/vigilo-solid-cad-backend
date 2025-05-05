
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    mobile: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v, "any", { strictMode: true });
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    otp: {
        type: String,
    },

    otpExpiry: Date,

    isOtpVerified: {
        type: Boolean,
        default: false,
    },
    
    role: {
        type: String,
        enum: ["client", "admin","guard"],
        required: true,
    },

}, { timestamps: true });


// Pre save hook
userSchema.pre("save", async function (next) {
    // avoid hashing when other fields except password are updated
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});


// Compare hashed password with entered password
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

// Generate JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const userModel = mongoose.model("user", userSchema);

export default userModel;
