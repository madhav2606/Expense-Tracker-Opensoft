import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';

const authenticatedUser = async(email,password)=>{
  try{
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Email not found" };
    }
    if (password!=(user.password)) {
      return { success: false, message: "Invalid password" };
    }
    return { success: true, message: "User authenticated", user };
  } catch (error) {
      console.error("Error during authentication:", error.message);
      return { success: false, message: "Server error during authentication", error };
  }
}
  
export const registerUser = (async (req, res) => {
  
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(408).json({message: "Enter all fields "});
    }
        try {
          const userExists = await User.findOne({ email });
          if (userExists) {
            console.log(`Registration failed: User already exists with email: ${email}`);
            return res.status(400).send({ message: 'User already exists' });
          }
          const user = new User({ email, password });
          await user.save();

          res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Server Error', error });
        }
});

export const loginUser = (async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
    try {
      const authResult = await authenticatedUser(email, password);
      console.log(authResult);
      if (!authResult.success) {
        return res.status(401).json({ message: authResult.message });
      }

    const payload = { id: authResult.user._id, email: authResult.user.email }; 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); 

    return res.status(200).json({
      message: 'User successfully logged in',
      token: token
    });

    } catch (error) {
        return res.status(500).send(error.message);
    }
    
});

// export const authenticateUser = (async (req, res) => {
//     try {
//         const token = req.session.authorization?.accessToken; 
//         if (!token) {
//           return res.status(401).json({ message: "Not authenticated, try login first" });
//         }
    
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return res.status(200).json({ message: "User authenticated", email: decoded.email });
//       } catch (error) {
//         return res.status(401).json({ message: "Token is not valid", error: error.message });
//       }
// });

export const logoutUser = async (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};