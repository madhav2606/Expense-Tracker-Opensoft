
import { Expense } from '../models/expenseModel.js'
import { User } from '../models/User.js';
import { logActivity } from './activity.controller.js';

export const AddExpense = async (request, response) => {
    try {
        if (!request.body.amount || !request.body.description || !request.body.date || !request.body.category || !request.body.paymentMethod) {
            return response.status(400).send({
                message: 'Send all required fields including userId',
            });
        }

        const { amount, description, date, category, paymentMethod } = request.body;
        const {id}=request.params
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).send({ message: 'User not found' });
        }

        const newExpense = {
            amount,
            description,
            date,
            paymentMethod,
            category,
            createdBy: id,
        };

        const expense = await Expense.create(newExpense);

        await User.findByIdAndUpdate(
            id,
            { $push: { expenses: expense._id } },
            { new: true }
        );

        await logActivity(id,"Expense addition");

        return response.status(201).send(expense);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const UpdateExpense = async (request, response) => {
    try {
        if (!request.body.amount || !request.body.description || !request.body.date || !request.body.category || !request.body.paymentMethod) {
            return response.status(400).send({
                message: "Send all required fields",
            });
        }

        const { id,userId } = request.params;
    
        const result = await Expense.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: "Expense not found" });
        }

        await logActivity(userId,"Expense Update")

        return response.status(200).send({ message: "Expense updated successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const DeleteExpense = async (request, response) => {
    try {
        const { id,userId } = request.params;

        const result = await Expense.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Expense not found" });
        }

        await User.updateOne(
            { expenses: id }, 
            { $pull: { expenses: id } }
        );

        await logActivity(userId,"Expense deletion")

        return response.status(200).send({ message: "Expense deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
};

export const GetExpenses = async (req, res) => {
    try {
        const { userId } = req.params; 
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const expenses = await Expense.find({ createdBy: userId });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this user" });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
