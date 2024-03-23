// Home.js
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectGoals } from "./components/features/loginUserSlice";

const Home = () => {
    const storedUser = localStorage.getItem('user');
    const storedGoals = localStorage.getItem('goals');
    const user = useSelector(selectUser) || JSON.parse(storedUser);
    const goals = useSelector(selectGoals) || JSON.parse(storedGoals)[0];

    console.log("goals: ", goals)
    console.log(user);
    return (
        <div>
            <h1>Welcome, {user ? user.name : 'Guest'}!</h1>
            <ul>
                {goals.map((goal) => (
                    <li key={goal._id}>{goal.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
