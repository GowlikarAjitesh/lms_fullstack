const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'instructor', 'admin'], //only allow user or admin roles.
        default: 'user'
    },
    profileImage: {
        type: String,
        default: "",
    },
    profileImagePublicId: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },

}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);