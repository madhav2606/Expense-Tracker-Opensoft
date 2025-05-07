import mongoose from "mongoose";
import { Bill } from "../models/Bill.js";
import { Group } from "../models/Group.js";

// "/createBill" - Create a bill with multiple payers
export const createBill = async (req, res) => {
    try {
        const { group, description, amount, payers, participants } = req.body;

        // Ensure group exists
        const groupExists = await Group.findById(group);
        if (!groupExists) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Validate payers
        if (!payers || payers.length === 0) {
            return res.status(400).json({ message: "At least one payer is required." });
        }

        // Ensure total amount paid matches bill amount
        const totalPaid = payers.reduce((sum, payer) => sum + payer.amountPaid, 0);
        if (totalPaid !== parseFloat(amount)) {
            return res.status(400).json({ message: "Total paid amount does not match bill amount." });
        }

        const newBill = await Bill.create({
            group,
            description,
            amount,
            payers,
            participants,
            status: "Unpaid"
        });

        await Group.findByIdAndUpdate(group, { $push: { expenses: newBill._id } });

        res.status(201).json({ message: "Bill created successfully", bill: newBill });
    } catch (error) {
        res.status(500).json({ message: "Error creating bill", error: error.message });
    }
};

// "/getBills/:groupId" - Fetch all bills for a group
export const getBillsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const bills = await Bill.find({ group: groupId })
            .populate("payers.userId", "name") // Populate payer details
            .populate("participants", "name"); // Populate participant details

        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bills", error: error.message });
    }
};

// "/getBill/:billId" - Fetch a specific bill
export const getBillById = async (req, res) => {
    try {
        const { billId } = req.params;
        const bill = await Bill.findById(billId)
            .populate("payers.userId", "name")
            .populate("participants", "name");

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bill", error: error.message });
    }
};

// "/updateBill/:billId" - Update bill details
export const updateBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const updatedBill = await Bill.findByIdAndUpdate(billId, req.body, { new: true });

        if (!updatedBill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.status(200).json({ message: "Bill updated successfully", bill: updatedBill });
    } catch (error) {
        res.status(500).json({ message: "Error updating bill", error: error.message });
    }
};

// "/deleteBill/:billId" - Delete a bill
export const deleteBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const deletedBill = await Bill.findByIdAndDelete(billId);

        if (!deletedBill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        await Group.findByIdAndUpdate(deletedBill.group, { $pull: { expenses: billId } });

        res.status(200).json({ message: "Bill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting bill", error: error.message });
    }
};

// "/getBalances/:groupId" - Calculate who owes/receives what
export const getBalances = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.query; // Get user ID from query parameters

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ensure group exists
        const group = await Group.findById(groupId).populate("users", "name");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Fetch all bills in the group (excluding already paid bills)
        const bills = await Bill.find({ group: groupId, status: { $ne: "Paid" } })
            .populate("payers.userId participants", "name");

        // Initialize balances object
        let balances = {};

        // Set initial balance for each user in the group
        group.users.forEach(user => {
            balances[user._id] = { name: user.name, owes: 0, receives: 0, net: 0 };
        });

        // Process each bill
        bills.forEach(bill => {
            const totalAmount = bill.amount;
            const numParticipants = bill.participants.length;
            const sharePerPerson = totalAmount / numParticipants; // Split equally among all participants

            // Each participant owes an equal share
            bill.participants.forEach(participant => {
                balances[participant._id].owes += sharePerPerson;
            });

            // Each payer's contribution is added to their "receives" balance
            bill.payers.forEach(payer => {
                balances[payer.userId._id].receives += payer.amountPaid;
            });
        });

        // Calculate net balance (Receives - Owes)
        Object.keys(balances).forEach(userId => {
            balances[userId].net = balances[userId].receives - balances[userId].owes;
        });

        // Return only the requested user's balance
        const userBalance = balances[userId] || { name: "Unknown", owes: 0, receives: 0, net: 0 };

        res.status(200).json(userBalance);
    } catch (error) {
        res.status(500).json({ message: "Error calculating balance", error: error.message });
    }
};

// "/getSmartSettleUp/:billId" - Fetch smart settlement details for a bill
export const getSmartSettleUp = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await Bill.findById(billId)
            .populate("payers.userId", "name")
            .populate("participants", "name");

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        const share = bill.amount / bill.participants.length;


        const balances = {};

        bill.participants.forEach(p => {
            balances[p._id] = { name: p.name, net: -share };
        });

        bill.payers.forEach(payer => {
            const id = payer.userId._id;
            if (!balances[id]) {
                balances[id] = { name: payer.userId.name, net: 0 };
            }
            balances[id].net += payer.amountPaid;
        });

        const netBalances = Object.entries(balances)
            .map(([id, data]) => ({
                id,
                name: data.name,
                amount: parseFloat(data.net.toFixed(2))
            }))
            .filter(person => Math.abs(person.amount) > 0.01);

        let debtors = netBalances.filter(p => p.amount < 0).sort((a, b) => a.amount - b.amount);
        let creditors = netBalances.filter(p => p.amount > 0).sort((a, b) => b.amount - a.amount);

        const settlements = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const amount = Math.min(-debtor.amount, creditor.amount);
            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: amount.toFixed(2)
            });

            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (Math.abs(creditor.amount) < 0.01) j++;
        }

        res.status(200).json({
            message: "Smart settle-up completed successfully",
            settlements
        });

    } catch (err) {
        res.status(500).json({
            message: "Error performing smart settle-up",
            error: err.message
        });
    }
};





