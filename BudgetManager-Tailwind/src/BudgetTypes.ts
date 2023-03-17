export type User = {
    userId: number,
    userName: string,
    budget: number
}

export type Expense = {
    expenseId: number,
    cost: number,
    label: string,
    category: string,
    userId: number
}

export type budget = {
    budget: number;
}