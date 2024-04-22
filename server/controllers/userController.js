const User = require("../modals/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let path = require('path');

const registerUser = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ err: "Please fill the fields" });
    }

    try {
        const userExists = await User.findOne({ userName });

        if (userExists) {
            return res.status(400).json({ err: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({
            userName,
            password: hashedPassword,
        });

        if (user) {
            return res.status(201).json({
                id: user._id,
                userName: user.userName,
                status: "User Created",
            });
        } else {
            return res.status(400).json({ msg: "Invalid User Data" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// check user existance while register user
const checkUserExistance = async (req, res) => {
    const { userName } = req.body;
    try {
        const userExists = await User.findOne({ userName });
        res.json({ exists: !!userExists });
    }
    catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// login user
const loginUser = async (req, res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName }).maxTimeMS(30000);

    // console.log(userName, password, "login")

    if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            _id: user._id,
            userName: user.userName,
            token: generateToken(user._id),
            status: "Login Successfull"
        })
    }
    else {
        return res.status(401).json({ msg: "Invalid User Data" });
    }
}

const getMe = async (req, res) => {
    const { _id, userName } = await User.findById(req.user.id);
    return res.status(200).json({ _id, userName });
}
// get users
const getUser = async (req, res) => {
    try {
        const userData = await User.find();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}
// put operation-- for resetting password
// forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Exists!" });
        }
        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "15m" });

        const link = `http://localhost:3000/hrm/reset-password/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'devibalamaheshkannan99@gmail.com',
                pass: 'yucm rwsy hmqy ljrs'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'devibalamaheshkannan99@gmail.com',
            subject: 'Reset Your Password',
            text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Failed to send email' });
            }
            else {
                // console.log('Email sent: ' + info.response);
                res.json({ status: 'Email sent successfully' });
            }
        });
    } catch (error) {
        // console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User not exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index",
            { email: verify.email, status: "Not verified" });

    }
    catch (error) {
        console.log(error);
        res.send("Not Verified");
    }
}
const postResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    const oldUser = await User.findOne({ _id: id });
    // console.log(password, confirmPassword);
    if (!oldUser) {
        return res.json({ status: "User not exists!!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ status: "Passwords do not match" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 8);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword
                }
            }
        )

        res.status(200).json({ email: verify.email, status: "verified" });
    }
    catch (error) {
        res.status(500).json({ status: "Something went wrong" });
    }
}
// updateUser
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { userName, password } = req.body;
    // console.log("User ID:", userId);
    // console.log(userName, password);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (userName) user.userName = userName;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 8);
            user.password = hashedPassword;
        }
        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser, loginUser, getMe, getUser, checkUserExistance,
    forgotPassword, getResetPassword, postResetPassword, updateUser, deleteUser
}

