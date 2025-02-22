import mongoose from "mongoose";
import { nanoid } from "nanoid";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Bill",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        inviteCode: {
            type: String,
            default: () =>
                nanoid(11),
        }
    },
    { timestamps: true }
);

export const Group = mongoose.model("Group", GroupSchema);