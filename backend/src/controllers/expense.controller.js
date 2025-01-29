import express, { request } from 'express'
const router = express.Router();
// router.use(express.json());

import { Expense } from '../models/expenseModel.js';

export const AddExpense = async(request,response) => {
    try{
        if(!request.body.amount || !request.body.description || !request.body.date || !request.body.category ||!request.body.paymentMethod){
            return response.status(400).send({
                message:'send all required fields plz',
            });
        }
        const newExpense = {
            amount: request.body.amount,
            description: request.body.description,
            date: request.body.date,
            paymentMethod: request.body.paymentMethod,
            category: request.body.category,
        };

        const expense = await Expense.create(newExpense);
        console.log(expense);
        return response.status(201).send(expense);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}

export const UpdatExpense = async(request,response)=>{
    try {
        if(!request.body.amount|| !request.body.description|| !request.body.date ||!request.body.category ||!request.body.paymentMethod){
            return response.status(400).send({
                message:"send all required field"
            });
        }
        const {id} = request.params;
        const result = await Expense.findByIdAndUpdate(id,request.body);

        if(!result){
            return response.status(404).json({message:"expense not found"});
        }
        return response.status(200).send({message:"expense updated successsfully"})
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
}


export const DeleteExpense = async(request,response)=>{
    try {
        const {id} = request.params;
        const result = await Expense.findByIdAndDelete(id);

        if(!result){
            return response.status(404).json({message:"expense not found"});
        }
        return response.status(200).send({message:"expense deleted successsfully"})
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
}

export default router;