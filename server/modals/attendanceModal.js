const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    emp_name: {
        type: String,
    },
    status_work: {
        type: String,

    },
    permission: {
        type: String,

    },
    leave: {
        type: String,

    },
    in_date: {
        type: String,

    },
    in_time: {
        type: String,

    },
    out_date: {
        type: String,

    },
    out_time: {
        type: String,

    },
    comments: {
        type: String,
    }
});

module.exports = mongoose.model("Employee_Attendance", attendanceSchema);