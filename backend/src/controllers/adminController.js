const Incident = require('../models/Incident');
const BannedDevice = require('../models/BannedDevice');

const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({ status: 'open' }).populate('reporterId targetId matchId');
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resolveIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (incident) {
            incident.status = 'resolved';
            const resolved = await incident.save();
            res.json(resolved);
        } else {
            res.status(404).json({ message: 'Incident not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBannedDevices = async (req, res) => {
    try {
        const devices = await BannedDevice.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getIncidents,
    resolveIncident,
    getBannedDevices,
};
