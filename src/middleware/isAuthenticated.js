import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import userModel from "../@user_entity/user_model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new CustomError("Not Authorized: No token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id || decoded.id); // handle both cases

    if (!user) {
      return next(new CustomError("Not Authorized: User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new CustomError("Not Authorized: Invalid or expired token", 401));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Not an admin" });
  }
  next();
};

export const isGuard = (req, res, next) => {
  if (req.user.role !== "guard") {
    return res.status(403).json({ message: "Access denied: Not a guard" });
  }
  next();
};

export const isClient = (req, res, next) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Access denied: Not a client" });
  }
  next();
};

export default isAuthenticated;
