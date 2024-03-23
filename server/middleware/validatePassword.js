const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
        return res.status(400).json({ message: 'Password does not meet requirements' });
    }

    next();
}