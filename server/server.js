const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const goalRoutes = require("./routes/goalRoutes");
const studentRoutes = require("./routes/studentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentReceiptRoutes = require("./routes/studentReceiptRoutes");
const customerReceiptRoutes = require("./routes/customerReceiptRoute");
const cashoutRoutes = require("./routes/cashoutRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const staffRoutes = require("./routes/staffRoutes");
const leadRoutes = require("./routes/leadRoutes");
const leadExcelRoutes = require("./routes/leadExcelRoutes");
const excelController = require("./controllers/excelController");
const interviewRoutes = require("./routes/interviewRoutes");
// env
require("dotenv").config();

const app = express();
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
app.use("/employee_uploads", express.static("employee_uploads"));


const PORT = process.env.PORT || 8046;
const url = process.env.DB_CONNECTION;

// Check if DB_CONNECTION environment variable is set
if (!url) {
    console.error('DB_CONNECTION environment variable is not set.');
    process.exit(1); // Exit the application if DB_CONNECTION is not set
}

// routes
app.use("/hrm", userRoutes);
app.use("/goals", goalRoutes);
app.use("/info", studentRoutes);
app.use("/employee", employeeRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/clients", clientRoutes);
app.use("/invoiceDetail", invoiceRoutes);
app.use("/course", courseRoutes);
app.use("/studentReceipt", studentReceiptRoutes);
app.use("/customerReceipt", customerReceiptRoutes);
app.use("/cashout", cashoutRoutes);
app.use("/vendors", vendorRoutes);
app.use("/staff", staffRoutes);
app.use("/lead", leadRoutes);
app.use("/leadData", leadExcelRoutes);
app.use("/excelData", excelController);
app.use("/interviews", interviewRoutes);


mongoose.connect(url).then(() => {
    console.log("Connected Successfully");
})
    .catch((err) => {
        console.log("Connection Failure " + err);
    })
// test
app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})