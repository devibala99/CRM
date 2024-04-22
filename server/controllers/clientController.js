const Clients = require("../modals/clientModal");

const setClient = async (req, res) => {
    try {
        const newClient = await Clients.create({
            clientName: req.body.clientName,
            address: req.body.address,
            date: req.body.date,
            state: req.body.state,
            inVoice_no: req.body.inVoice_no,
            phoneNumber: req.body.phoneNumber,
            gst_in: req.body.gst_in
        });
        res.status(200).json(newClient);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getClient = async (req, res) => {
    try {
        const clients = await Clients.find();
        if (!clients || clients.length === 0) {
            return res.status(200).json({ message: "No Clients Found", clients: [] });
        }
        const response = clients.map(client => ({
            id: client._id,
            clientName: client.clientName,
            address: client.address,
            date: client.date,
            state: client.state,
            inVoice_no: client.inVoice_no,
            phoneNumber: client.phoneNumber,
            gst_in: client.gst_in
        }));
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error getting Employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Client ID is required" });
        }

        const deleteClient = await Clients.findByIdAndDelete(id);

        if (!deleteClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client Deleted Successfully" });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    setClient, getClient, deleteClient
}