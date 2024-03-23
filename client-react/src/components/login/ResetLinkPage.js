import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./forgotPassword.css"
const ResetLinkPage = () => {
    const { id, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            alert("Please enter both password and confirm password.");
            setError('Please enter both password and confirm password.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8011/hrm/reset-password/${id}/${token}`,
                {
                    password, confirmPassword
                });
            console.log(response.data)
            if (response.status === 200 && response.data.status === 'verified') {
                if (window.confirm("Do you want to login?")) {
                    window.location.href = "http://localhost:3000/";
                }
            }
        }
        catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className='reset-container'>
            <div className="reset-content">
                <div className="reset-title">
                    <h2>Reset Password</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                </div>

                <form action="" method="post" onSubmit={handleSubmit}>
                    <input type="text" autoComplete="username" name="username" id="username" style={{ display: 'none' }} />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm-Password"
                        autoComplete="new-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <br />
                    <button>Submit</button>
                </form>
            </div>

        </div>
    );
};

export default ResetLinkPage;
