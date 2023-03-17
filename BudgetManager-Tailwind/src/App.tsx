import React, {useEffect, useState} from 'react'
import {Expense, User} from './BudgetTypes'
import UserScreen from "./Components/UserScreen"
import UserExpense from './Components/UserExpense';

function App() {
    const [user, setUser] = useState<User>();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [budget, setBudget] = useState<number>(0);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [postLabel, setPostLabel] = useState<string>('');
    const [postCost, setPostCost] = useState<number>();
    const [hideAdd, sethideAdd] = useState<boolean>(true);
    const [total, setTotal] = useState<number>();
    const [category, setCategory] = useState<string>("Life");
    const [filter, setFilter] = useState<string>("All");
    const [death, setDeath] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [blur, setBlur] = useState<boolean>(true);

    const userCallback = (User: User) => {
        setUser(User);
        refreshData();
        setBlur(false);
    }

    const refreshData = () => {
        setRefresh(prev => !prev);
    }

    const fetchExpenses = async () => {
        const expenses = await fetch(`http://localhost:5164/api/Expense?userId=${Number(user?.userId)}`);
        const json: Expense[] = await expenses.json();
        setExpenses(json);
    }

    const updateBudget = async (e: any) => {
        e.preventDefault();
        await fetch(`http://localhost:5164/api/Expense/User/${user?.userId}/Budget/${budget}`, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
        }).then(resp => {
            console.log(resp)
        })
        setDisabled(true);
    }
    const handleChange = (e: any) => {
        e.preventDefault();
        setBudget(Number(e.target.value));
    }

    const deleteExpense = async (id: number) => {
        await fetch(`http://localhost:5164/api/Expense/${id}`, {
            method: "DELETE"
        }).then(res => {
            console.log(res);
            fetchExpenses();
        })
    }

    const addExpense = async (e: any) => {
        e.preventDefault();
        if(postLabel == ''){
            setError("Enter a valid title");
            return;
        }
        const expense: Expense = {
            expenseId: 0,
            cost: postCost as number,
            label: postLabel as string,
            userId: user?.userId as number,
            category: category as string
        }
        await fetch(`http://localhost:5164/api/Expense`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(expense)
        }).then(resp => {
            console.log(resp)
            fetchExpenses();
            setPostLabel("");
            setError('');
        })
    }

    const calcTotal = () => {
        let outval = 0;
        expenses.forEach(element => {
            outval += element.cost
        })
        setTotal(outval);
    }

    const updateCost = (e: { target: { value: any; }; }) => setPostCost(Number(e.target.value));
    const updateLabel = (e: { target: { value: any; }; }) => setPostLabel(e.target.value);
    const updateCategory = (e: { target: { value: any; }; }) => setCategory(e.target.value);
    const updateFilter = (e: { target: { value: any; }; }) => setFilter(e.target.value);

    useEffect(() => {
        setBudget(user?.budget as number);
    }, [refresh])

    useEffect(() => {
        if (!user?.userId) {
            return;
        }
        fetchExpenses();
    }, [user])

    useEffect(() => {
        calcTotal();
    }, [expenses])

    useEffect(() => {
        if (total as number > budget) {
            setDeath(false);
            return;
        }
        setDeath(true);
    }, [total])

    return (
        <>
            <div className="flex flex-col items-center text-center bg-gray-900 bg-gradient-to-bl min-h-screen bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 background-animate w-full">
                <div hidden={death} className="pt-4">
                    <img className="rounded-2xl" src="https://media.tenor.com/eS3gUBnOLukAAAAM/broke.gif" alt="yes"/>
                    <p className="text-red-400">{user?.userName}, you overspent again... </p>
                </div>
                <header className="">
                    <UserScreen user={user} callback={userCallback}/>
                </header>
                <div hidden={blur}>
                <h3 className="mb-5 font-light">Your Budget:</h3>
                <div>
                    <form onSubmit={updateBudget} onClick={() => setDisabled(false)}>
                        <input
                            className="hover:cursor-pointer font-semibold text-lg text-center text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125 hover:scale-105"
                            value={budget == 0 ? "" : budget} disabled={disabled} type='number'
                            onChange={handleChange}/>
                        <br/>
                        <button
                            className="w-20 m-2 text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125 hover:scale-105"
                            hidden={disabled} type="submit">Save
                        </button>
                    </form>
                </div>
                <h4 className="mt-5">Amount spent: ${total}</h4>
                <br/>
                <button className="font-light m-4 hover:scale-105 transition-all duration-150 ease-in-out"
                        onClick={() => sethideAdd(prev => !prev)}>{hideAdd ? "Show" : "Hide"}</button>
                <div hidden={hideAdd} className="w-60">
                    <h3 className="border-b-2 m-2">Add Expense</h3>
                    <form onSubmit={addExpense} className="drop-shadow-md shadow-blue-50">
                        <label className="text-sm"> Name:
                            <br/>
                            <input
                                className="hover:hue-rotate-30 text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125"
                                type="text" onChange={updateLabel} value={postLabel}/>
                            <br/>
                            <p>{error}</p>
                        </label>
                        <br/>
                        <label className="text-sm"> Cost:
                            <br/>
                            <input
                                className="hover:hue-rotate-30 text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125"
                                type="number" onChange={updateCost}/>
                        </label>
                        <br/>
                        <br/>
                        <label> Category
                            <br/>
                            <select
                                className="hover:hue-rotate-15 text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125"
                                onChange={updateCategory}>
                                <option value="Life">Life</option>
                                <option value="Leisure">Leisure</option>
                                <option value="Food">Food</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Clothing">Clothing</option>
                            </select>
                        </label>
                        <br/>
                        <br/>
                        <button className="hover:scale-105 hover:-hue-rotate-60 transition-all duration-100 ease-in-out bg-blue-200 text-black rounded-2xl w-20" type="submit">Add</button>
                        <p className="mt-5 border-b-2 rounded-2xl opacity-60"></p>
                    </form>
                </div>
                <br/>
                <label> Filter
                    <br/>
                    <select
                        className="hover:cursor-pointer text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125 hover:scale-105"
                        onChange={updateFilter}>
                        <option value="All">All</option>
                        <option value="Life">Life</option>
                        <option value="Leisure">Leisure</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Clothing">Clothing</option>
                    </select>
                </label>
                <h3 className="m-6 text-lg">Your Expenses:</h3>
                </div>
                <div className="pt-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 pb-5">
                    {filter == "All" ? expenses.map((element: Expense) => {
                        return <UserExpense expense={element} callback={deleteExpense}/>;
                    }) : expenses.filter(x => x.category == filter).map((element: Expense) => {
                        return <UserExpense expense={element} callback={deleteExpense}/>;
                    })}
                </div>
            </div>
        </>
    )
}

export default App
