import mongoose from 'mongoose';
import { User } from './User.js';

const expenseSchema = mongoose.Schema(
    {
          amount:{
            type:String,
            required:true,
          },
          description:{
            type:String,
            required:true,
          },
          date:{
            type:Date,
            required:true,
          },
          category:{
            type:String,
            required:true,
          },
          paymentMethod:{
            type:String,
            required:true,
          },
          createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
          }
    },
    {
        timestamps:true,
    }
)

export const Expense = mongoose.model('expense', expenseSchema);