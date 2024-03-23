import React, { useState } from 'react'
import axios from 'axios';
import "./forgotPassword.css"
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
        try {
            await axios.post("http://localhost:8011/hrm/forgot-password", {
                email,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            setEmail("");
            setMessage("Mail sent to the user ");
        } catch (error) {
            console.error('Error sending reset password email:', error);
            setMessage('Failed to send reset password email. Please try again later.');
        }

    }
    return (
        <div className='forgot-container'>
            <div className="forgot-content">
                <div className='forgot-title'>
                    <h2>Forgot Password</h2>
                    <p>Please enter your email address and we'll send you a link to reset password</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button>Submit</button>
                </form>

            </div>
            <br />
            {message && <p>{message}</p>}
        </div>
    )
}

export default ForgotPassword
