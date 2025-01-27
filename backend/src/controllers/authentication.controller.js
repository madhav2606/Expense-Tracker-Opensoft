import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';


const authenticatedUser = (username,password)=>{
    let validusers = User.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
export const registerUser = (async (req, res) => {
    const { email, password} = req.body;
    if (!username || !password) {
      return res.status(404).json({message: "Enter all fields"});
    }
        try {
          const userExists = await User.findOne({ email });
          if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
          }
      
          const user = new User({ email, password });
          await user.save();
      
          res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Server Error', error });
        }
});

export const loginUser = (async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
    try {
        if (authenticatedUser(username,password)) {
            let accessToken = jwt.sign({
            data: password
          }, process.env.JWT_SECRET , { expiresIn: 60 * 60 });
      
          req.session.authorization = {
                  accessToken,username
              }
              return res.status(200).send("User successfully logged in");
          }
        
    } catch (error) {
        return res.status(208).json({message: error.message});
    }
    
});

export const authenticateUser = (async (req, res) => {
    try {
        const token = req.session.authorization?.accessToken; 
        if (!token) {
          return res.status(401).json({ message: "Not authenticated, try login first" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "User authenticated", user: decoded.username });
      } catch (error) {
        return res.status(401).json({ message: "Token is not valid", error: error.message });
      }
});

export const logoutUser = async (req, res) => {
    try {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Error logging out", error: err });
          }
    
          res.status(200).json({ message: "User logged out successfully" });
        });
      } catch (error) {
        return res.status(500).json({ message: "Server error during logout", error });
      }
};