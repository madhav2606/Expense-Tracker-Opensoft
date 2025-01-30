import { json } from "express";
import { Activity } from "../models/ActivityModel.js";


export const getActivity = async (req, res) => {
    try {
        const activities = await Activity.find().populate("user", "name").sort({ timestamp: -1 }).lean();

        const modifiedActivities = activities.map(activity => ({
            _id: activity._id,
            user: activity.user?.name || "Unknown",
            action: activity.action,
            timestamp: activity.timestamp
        }));

        res.status(200).json(modifiedActivities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
}


export const logActivity = async (userId, action) => {
    try {
        await Activity.create({
            user: userId,
            action,
        });
    } catch (error) {
        res.status(500).json({ message: "Error Logging activities", error: error.message })
    }
}