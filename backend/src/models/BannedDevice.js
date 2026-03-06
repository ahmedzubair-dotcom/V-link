const mongoose = require('mongoose');

const bannedDeviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    },
    bannedAt: {
        type: Date,
        default: function () {
            return Date.now();
        }
    }
}, { timestamps: true });

const BannedDevice = mongoose.model('BannedDevice', bannedDeviceSchema);
module.exports = BannedDevice;
