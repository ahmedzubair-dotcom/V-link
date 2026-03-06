const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    flagged: {
        type: Boolean,
        default: false // GuardianShield moderation flag
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
