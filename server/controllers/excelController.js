const express = require('express');
const ExcelLead = require('../modals/excelModal');
const router = express.Router();

router.post('/insert_excelFiles', async (req, res, next) => {
    try {
        const tests = req.body;
        const insertedDocs = await ExcelLead.insertMany(tests);

        if (insertedDocs.length > 0) {
            res.status(200).json({ success: true, message: "Insert Successfully" });
        } else {
            // console.log("Insert Error", error);
            res.status(400).json({
                success: false,
                error: error,
                message: "Failed to insert data"
            });
        }
    } catch (error) {
        console.error('Error processing uploaded file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/upadte_excelFiles', async (req, res, next) => {
    try {
        const tests = req.body;

        const promises = tests.map(async (item) => {
            const res = await ExcelLead.findByIdAndUpdate(item._id, {
                $set: { ...item },
            })
            return res;
        })
        Promise.all(promises).then(() => res.json({ success: true, message: "Update Successfully" })
        )
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error('Error processing uploaded file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/', async (req, res) => {
    try {
        const data = await ExcelLead.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/update_excelFile/:id', async (req, res) => {
    try {
        const updatedLead = await ExcelLead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, message: "Lead updated successfully", data: updatedLead });
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
router.delete('/delete_excelFile/:id', async (req, res) => {
    try {
        const deletedLead = await ExcelLead.findByIdAndDelete(req.params.id);
        if (!deletedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }
        res.status(200).json({ success: true, message: "Lead deleted successfully", data: deletedLead });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
