import React from 'react'
import {Expense} from "../BudgetTypes";
import '../App.css'
import {motion} from 'framer-motion'


type expenseProps = {
    expense: Expense;
    callback: any;
}

function UserExpense(props: expenseProps) {
    const handleCallback = () => {
        props.callback(props.expense.expenseId)
    }

    return (
        <motion.div
            className="m-2 flex flex-col mt-6 border-2 w-64 transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-blue-50"
            animate={{opacity: 1, rotateX: 0}}
            initial={{opacity: 0, rotateX: 90}}>
            <h5 className="ml-2 text-left border-b-2 mb-4">{props.expense.label}</h5>
            <h5 className="ml-2 text-left mb-5">Cost: ${props.expense.cost}</h5>
            <h5 className="ml-2 text-left text-opacity-75 text-gray-50 mb-5">Category: {props.expense.category}</h5>
            <button className="expense-button bg-indigo-300 text-black font-bold" onClick={handleCallback}>Remove
            </button>
        </motion.div>
    )
}

export default UserExpense
