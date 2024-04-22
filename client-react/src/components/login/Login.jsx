/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { createUser, checkUser } from "../features/registerDetailSlice";
import { loginUser, setUser, setToken, setGoals, fetchGoals, selectIsAuthenticated } from "../features/loginUserSlice"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})
const Login = () => {
    const location = useLocation();
    // login user data
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [loginDetails, setLoginDetails] = useState({ userName: '', password: '' })
    // snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    // const currLoginUser = useSelector(selectUser);
    // navigate
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);


    useEffect(() => {
        const disableBack = () => {
            window.history.forward();
        };

        if (isAuthenticated && location.pathname === '/home') {
            setTimeout(disableBack, 0);
            window.onunload = null; // To prevent memory leaks
        }
    }, [isAuthenticated, location.pathname]);


    // functions to open signup / signin section
    const handleSignUpClick = () => {
        setIsSignUpActive(true);
    }
    const handleSignInClick = () => {
        setIsSignUpActive(false);
    }

    // register functions
    // const handelRegisterChange = (e) => {
    //     const { name, value } = e.target;
    //     setRegisterDetails((prevUsers) => (
    //         { ...prevUsers, [name]: value, }
    //     ));
    //     e.stopPropagation();
    // }
    // check user exist or not
    const checkData = async (email) => {
        const userExistsResult = await dispatch(checkUser(email));
        return userExistsResult;
    }
    // const handleRegisterSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const userExistsResult = await checkData(registerDetails.email);
    //         if (userExistsResult.payload) {
    //             // alert("User already exists with this email!");
    //             setSnackbarSeverity('error');
    //             setSnackbarMessage("User already exists with this email!")
    //             setSnackbarOpen(true);
    //         } else {
    //             // alert("User Created Successfully!");
    //             await dispatch(createUser(registerDetails));
    //             setSnackbarSeverity('success');
    //             setSnackbarMessage("User Created Successfully!");
    //             setSnackbarOpen(true);
    //             setRegisterDetails({
    //                 name: "",
    //                 email: "",
    //                 password: "",
    //             });
    //             setIsSignUpActive(false);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         // alert('Failed to create user.');
    //         setSnackbarSeverity('error');
    //         setSnackbarMessage("Failed to create user.");
    //         setSnackbarOpen(true);
    //     }
    // }

    // login functions
    const handleLoginChange = async (e) => {
        const { name, value } = e.target;
        setLoginDetails((prevUsers) => (
            { ...prevUsers, [name]: value, }
        ));
        e.stopPropagation();
    }
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log("login data--", loginDetails.userName, loginDetails.password);
        try {
            const response = await dispatch(loginUser({
                userName: loginDetails.userName,
                password: loginDetails.password,
            }));
            console.log(response, "response");

            setSnackbarSeverity('success');
            setSnackbarMessage("Login Successful!");
            setSnackbarOpen(true);
            // Store user details in local storage
            localStorage.setItem("user", JSON.stringify(response.payload.user));
            localStorage.setItem("token", response.payload.token);
            // set user and token in redux
            await dispatch(setUser(response.payload.user));
            await dispatch(setToken(response.payload.token));

            // for goals
            const data = await dispatch(fetchGoals({ userId: response.payload.user._id, token: response.payload.token }));
            // local storage for goals
            localStorage.setItem("goals", JSON.stringify(data.payload));
            // goals for redux storage            
            await dispatch(setGoals(data.payload));

            // Redirect to "/home" page
            navigate("/home");
        } catch (error) {
            // Handle login error
            if (error.message === "Incorrect user name or password") {
                setSnackbarSeverity('error');
                setSnackbarMessage("Incorrect user name or password");
                setSnackbarOpen(true);
                // alert("Incorrect email or password. Please try again.");
            } else {
                // alert("Login failed. Please try again later.");
                setSnackbarSeverity('error');
                setSnackbarMessage("Login failed. Please try again later.");
                setSnackbarOpen(true);
            }
        }
    }

    return (
        <div className="login-page-container">
            <div className={`user-container ${isSignUpActive ? 'right-panel-active' : ''}`}>
                <div className="form-container sign-in-container">
                    <form action="/" onSubmit={handleLoginSubmit}>
                        <h1>Sign in</h1>
                        <br />
                        <input type="text"
                            placeholder="User Name"
                            name="userName"
                            value={loginDetails.userName}
                            onChange={handleLoginChange}
                            className='input-index'
                            autoComplete="userName" />
                        <input type="password"
                            placeholder="Password"
                            name="password"
                            value={loginDetails.password}
                            onChange={handleLoginChange}
                            className='input-index'
                            autoComplete="current-password"
                        />
                        <Link to="/forgotPassword">Forgot your password?</Link>
                        <button className='btn-sign'>Sign In</button>
                    </form>
                </div>

                <footer>
                    <p>
                        Created By <i className="fa fa-heart"></i>&nbsp;<span style={{ color: "#0090dd", fontSize: "1rem" }}>Devi Bala</span>
                        {/**  <a target="_blank" rel="noreferrer" href="https://kitkatsoftwaretechnologies.com/"></a> */}
                    </p>
                </footer>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}

export default Login
