import React from 'react';
import { useSelector } from 'react-redux';
import { selectGoals } from './components/features/loginUserSlice';

const Goals = () => {
    const goals = useSelector(selectGoals);

    return (
        <div>
            Goals
            <div>
                <h1>Goals List</h1>
                {!goals || goals.length === 0 ? (
                    <p>Loading goals...</p> // Display loading message while data is being fetched
                ) : (
                    <ul>
                        {goals.map((goal) => (
                            <li key={goal._id}>{goal.text}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Goals;