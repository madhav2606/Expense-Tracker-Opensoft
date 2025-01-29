import mongoose from "mongoose";
import { User } from "../models/User.js";
import moment from "moment/moment.js";

// "/getUsers"
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

// "/changeStatus"
export const changeStatus = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "Email not found" };
        }

        const newStatus = user.status === "Active" ? "Inactive" : "Active";
        user.status = newStatus;
        await user.save();

        res.status(200).json({
            message: `User status updated to ${newStatus}`,
            user,
        });

    } catch (error) {
        res.status(500).json({ message: "Error changing user status", error: error.message });
    }
}

// "/changeRole"
export const changeRole = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "Email not found" };
        }

        const newRole = user.role === "Admin" ? "User" : "Admin";
        user.role = newRole;
        await user.save();

        res.status(200).json({
            message: `User Role updated to ${newRole}`,
            user,
        });

    } catch (error) {
        res.status(500).json({ message: "Error changing user Role", error: error.message });
    }
}

// "/deleteUser"
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

// "/updateUser"
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!name || !email) {
            return res.status(400).json({ message: "Enter all fields" });
        }

        // if(emailRegex.test(email)){
        //     return res.status(400).json({ message: 'Invalid email format' });
        // }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({
            message: `User updated successfully`,
            user,
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating user info", error: error.message });
    }
}

// "/dasboardStats"
export const dashStats = async (req, res) => {
     try {
        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({ status: 'Active' });

        const userRoles = await User.distinct('role');

         const { startOfWeek: startThisWeek, endOfWeek: endThisWeek } = getDateRange(0);
         const { startOfWeek: startLastWeek, endOfWeek: endLastWeek } = getDateRange(1);
 
         const newUsersThisWeek = await User.countDocuments({
             createdAt: { $gte: startThisWeek, $lt: endThisWeek }
         });
 
         const activeThisWeek = await User.countDocuments({
             updatedAt: { $gte: startThisWeek, $lt: endThisWeek }
         });
 
         const activeLastWeek = await User.countDocuments({
             updatedAt: { $gte: startLastWeek, $lt: endLastWeek }
         });
 
         let activityPercentageIncrease = 0;
         if (activeLastWeek > 0) {
             activityPercentageIncrease = ((activeThisWeek - activeLastWeek) / activeLastWeek) * 100;
         }

        const activePercentage = (activeUsers / totalUsers) * 100;
        let activityLevel = 'Low';
        if (activePercentage > 70) activityLevel = 'High';
        else if (activePercentage > 40) activityLevel = 'Medium';

        res.json({
            totalUsers,
            activeUsers,
            userRoles,
            activityLevel,
            activePercentage,
            newUsersThisWeek,
            activityPercentageIncrease
        }); 
     } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
     }
}

const getDateRange = (weeksAgo = 0) => {
    const startOfWeek = moment().subtract(weeksAgo, 'weeks').startOf('isoWeek').toDate();
    const endOfWeek = moment().subtract(weeksAgo, 'weeks').endOf('isoWeek').toDate();
    return { startOfWeek, endOfWeek };
};

// "/activityChart"

