const Lead = require('../modals/leadExcelModal');

const postLeadDetail = async (req, res) => {
    try {
        const { Date, Name, Qualification, YearOfPassing, PhoneNumber, FollowUpdates, Source } = req.body;

        const newLead = new Lead({
            Date,
            Name,
            Qualification,
            YearOfPassing,
            PhoneNumber,
            FollowUpdates,
            Source
        });

        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getLeadDetails = async (req, res) => {
    try {
        const leads = await Lead.find();

        if (!leads || leads.length === 0) {
            return res.status(404).json({ message: 'No leads found', leads: [] });
        }

        res.status(200).json(leads);
    } catch (error) {
        console.error('Error getting lead details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLeadDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead detail not found' });
        }
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLeadDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLead = await Lead.findByIdAndDelete(id);
        if (!deletedLead) {
            return res.status(404).json({ message: 'Lead detail not found' });
        }
        res.status(200).json({ message: 'Lead detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postLeadDetail,
    getLeadDetails,
    updateLeadDetail,
    deleteLeadDetail
};
