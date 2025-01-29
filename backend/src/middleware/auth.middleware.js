import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const checkForUserAuthentication = async (req, res, next) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1] 
      : null; 
        if (!token) {
          return res.status(401).json({ message:"No token, authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id).select("-password"); 
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
      } catch (err) {
        console.error("Authentication error:", err.message);
        res.status(401).json({ message: "Token is not valid" });
      }
};
