import mongoose from 'mongoose';
const expenseSchema = mongoose.Schema(
    {
          amount:{
            type:Number,
            required:true,
          },
          description:{
            type:String,
            required:true,
          },
          date:{
            type:Number,
            required:true,
          },
          category:{
            type:String,
            required:true,
          },
          PaymentMethod:{
            type:String,
            required:true,
          },
    },
    {
        timestamps:true,
    }
)

export const Expense = mongoose.model('expense', expenseSchema);