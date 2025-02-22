import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        payers: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                amountPaid: {
                    type: Number,
                    required: true
                }
            }
        ],
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        status: {
            type: String,
            enum: ["Paid", "Unpaid"],
            default: "Unpaid"
        }
    },
    { timestamps: true }
);

export const Bill = mongoose.model("Bill", BillSchema);
