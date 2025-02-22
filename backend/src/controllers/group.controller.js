import mongoose from "mongoose";
import { Group } from "../models/Group.js";
import { User } from "../models/User.js";
import { nanoid } from "nanoid";

// "/createGroup/:userId"
export const createGroup = async (req, res) => {
    const { name } = req.body;
    try {
        const inviteCode = nanoid(11);
        console.log(inviteCode)

        const group = await Group.create({
            name,
            createdBy: req.params.userId,
            inviteCode,
            users: [req.params.userId]
        });

        console.log(group)
        await User.findByIdAndUpdate(req.params.userId, { $push: { groups: group._id } });

        res.status(201).json({ group, inviteCode }); // Return invite code in response
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error: error.message });
    }
};

// "/deleteGroup/:groupId"
export const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await User.updateMany(
            { _id: { $in: group.users } },
            { $pull: { groups: group._id } }
        );

        await Group.deleteOne({ _id: req.params.groupId });

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error: error.message });
    }
}

// "/getGroups/:userId"
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ users: req.params.userId }).populate("users", "name").lean();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups", error: error.message });
    }
}

// "/joinGroup"
export const joinGroup = async (req, res) => {
    const { inviteCode, userId } = req.body;
    try {
        const group = await Group.findOne({ inviteCode });

        if (!group) {
            return res.status(404).json({ message: "Invalid invite code" });
        }

        if (group.users.includes(userId)) {
            return res.status(400).json({ message: "User already in the group" });
        }

        group.users.push(userId);
        await group.save();

        await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });

        res.status(200).json({ message: "Successfully joined the group", group });
    } catch (error) {
        res.status(500).json({ message: "Error joining group", error: error.message });
    }
};

// "/addMembers/:groupId"
export const addGroupMember = async (req, res) => {
    const { userId } = req.body;
    try {
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.users.includes(userId)) {
            return res.status(400).json({ message: "User already in the group" });
        }

        group.users.push(userId);
        await group.save();

        await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });

        res.status(200).json({ message: "User added to group", group });
    } catch (error) {
        res.status(500).json({ message: "Error adding user to group", error: error.message });
    }
};

// "/getGroup/:groupId"
export const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate("users", "name").lean();
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching group", error: error.message });
    }
}


