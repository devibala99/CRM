const Lead = require('../modals/leadModal');

// Create a new lead
const createLead = async (req, res) => {
    try {
        const {
            leadName,
            leadEmail,
            leadPhoneNumber,
            leadType,
            leadCompany,
            leadQualification,
            leadJobTitle,
            industry,
            commands,
            followUpdate,
            leadStatus,
            leadSource,
            leadCreatedOn,
            locationRegion,
            address,
        } = req.body;

        const newLead = new Lead({
            leadName,
            leadEmail,
            leadPhoneNumber,
            leadType,
            leadCompany,
            leadQualification,
            leadJobTitle,
            industry,
            commands,
            followUpdate,
            leadStatus,
            leadSource,
            leadCreatedOn,
            locationRegion,
            address,
        });

        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all leads
const getAllLeads = async (req, res) => {
    try {
        const allLeads = await Lead.find();
        res.status(200).json(allLeads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a lead
const updateLead = async (req, res) => {
    const { id } = req.params;

    try {
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        Object.assign(lead, req.body);

        const updatedLead = await lead.save();

        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a lead
const deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLead = await Lead.findByIdAndDelete(id);
        if (!deletedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLead,
    getAllLeads,
    updateLead,
    deleteLead
};
