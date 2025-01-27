import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const checkForUserAuthentication = async (req, res, next) => {

    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
          return res.status(401).json({ message: "No token, authorization denied" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id).select("-password"); 
        if (!req.user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        next();
      } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
      }
  
};
