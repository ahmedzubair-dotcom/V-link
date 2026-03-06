const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ matchId: req.params.matchId }).sort('timestamp');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
};
