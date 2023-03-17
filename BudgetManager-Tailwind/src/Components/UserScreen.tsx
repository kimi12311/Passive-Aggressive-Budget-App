import React, {useState} from 'react'
import {User} from "../BudgetTypes";
import '../App.css'


type screenProps = {
    user?: User,
    callback: any
}

function UserScreen(props: screenProps) {
    const [user, setUser] = useState<User>();
    const [userName, setUsername] = useState<string>();
    const [error, setError] = useState<string>();

    const handleChange = (e: any) => {
        setUsername(e.target.value);
    }

    const postUser = async (e: any) => {
        if (!userName) {
            setError("Please enter a valid username")
            return;
        }
        e.preventDefault();
        const userResponse = await fetch('http://localhost:5164/api/Expense/User/Name/' + userName);
        const json: User = await userResponse.json();
        console.log(json);
        setUser(await json);
        props.callback(json);
    }

    const shouldShowLogin = () => {
        if (!user) {
            return (
                <>
                    <div className="">
                        <div className="user-login-div">
                            <h3 className="m-3 text-xl mt-5">Welcome to Passive Aggressive Budgeting App!</h3>
                        </div>
                        <label className=""> Username:
                            <br/>
                            <input
                                className="m-2 text-black bg-blue-200 border-2 rounded-2xl transition-all duration-125 hover:scale-105"
                                onChange={handleChange} value={userName}/>
                        </label>
                        <br/>
                        <button
                            className="m-2 text-black bg-blue-200 w-20 rounded-2xl transition-all duration-125 hover:scale-105 hover:hue-rotate-60"
                            onClick={postUser}>Submit
                        </button>
                        <h5 className="p-2">{error}</h5>
                        <p className="text-sm text-gray-300 mb-5">If your username doesn't exist, we will create a new
                            account for you</p>
                    </div>
                </>
            )
        }
        return (
            <>
                <h2 className="mt-6 text-2xl text-sky-100 font-bold">Welcome back {user?.userName}!</h2>
                <button className="mb-5 hover:scale-105 transition-all duration-150" onClick={() => window.location.reload()}>Logout</button>
            </>
        )
    }

    return (
        <>
            {shouldShowLogin()}
        </>
    )
}

export default UserScreen
