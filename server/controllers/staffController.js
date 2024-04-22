const Staff = require('../modals/staffModal');

const createStaff = async (req, res) => {
    try {
        const { staffName, staffDoj, comments, userName, password } = req.body;
        const newStaff = new Staff({
            staffName,
            staffDoj,
            userName,
            password,
            comments
        });
        // console.log("stafff-backend---", newStaff);
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const allStaff = await Staff.find();
        res.status(200).json(allStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateStaff = async (req, res) => {
    const { id } = req.params;
    const { staffName, staffDoj, comments, userName, password } = req.body;

    try {
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        staff.staffName = staffName;
        staff.staffDoj = staffDoj;
        staff.comments = comments;
        staff.userName = userName;
        staff.password = password;

        const updatedStaff = await staff.save();
        res.status(200).json({ message: "Admin updated successfully", updateStaff });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStaff = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createStaff,
    getAllStaff,
    updateStaff,
    deleteStaff
};
