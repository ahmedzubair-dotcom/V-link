const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    collegeId: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    interests: {
        type: [String],
        default: [],
    },
    deviceId: {
        type: String, // Useful for GuardianShield banned devices check
    },
    threatScore: {
        type: Number,
        default: 0, // 0-100 score maintained by GuardianShield
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
