const Attendance = require("../modals/attendanceModal");

const setAttendance = async (req, res) => {
    try {

        const {
            emp_name,
            status_work,
            permission,
            leave,
            in_date,
            in_time,
            out_date,
            out_time
        } = req.body;

        const newAttendance = await Attendance.create({
            emp_name,
            status_work,
            permission,
            leave,
            in_date,
            in_time,
            out_date,
            out_time
        });
        res.status(201).json({ message: 'Attendance record created successfully', newAttendance });
    } catch (error) {
        console.error('Error creating attendance record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAttendance = async (req, res) => {
    try {

        const attendanceRecords = await Attendance.find();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            emp_name,
            status_work,
            permission,
            leave,
            in_date,
            in_time,
            out_date,
            out_time
        } = req.body;
        const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
            emp_name,
            status_work,
            permission,
            leave,
            in_date,
            in_time,
            out_date,
            out_time
        }, { new: true });

        if (!updatedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(updatedAttendance);
    } catch (error) {
        console.error('Error updating attendance record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAttendance = await Attendance.findByIdAndDelete(id);
        // console.log(id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { setAttendance, getAttendance, updateAttendance, deleteAttendance };

