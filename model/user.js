const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userType:{
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        default: 'default'
    },
    appointmentId: {
        type: String,
        required: true,
        default: 'default'
    },
    appointmentType: {
        type: String,
        required: true,
        default: 'default'
    },
    appointmentDate: {
        type: Date,
        required: false,
    },
    appointmentTime:{
        type: String,
        required: true,
        default: 'Currently not available'
    },
    comment: {
        type: String,
        required: true,
        default: 'Currently not available'
    },
    testResult: {
        type: String,
        required: true,
        default: 'Currently not available'
    },
    lastName: {
        type: String,
        required: true,
        default: 'default'
    },
    licenseNumber: {
        type: String,
        required: true,
        default: 'default'
    },
    dob: {
        type: Date,
        required: true,
        default:Date.now,
    },
    carDetails: {
        make: {
            type: String,
            required: true,
            default: 'default'
        },
        model: {
            type: String,
            required: true,
            default: 'default'
        },
        year: {
            type: Number,
            required: true,
            default: 0
        },
        plateNumber: {
            type: String,
            required: true,
            default: 'default'
        }

    }
});

userSchema.pre('save', function(next){
    const user = this
    bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash
    next()
    })
});
const User = mongoose.model('user', userSchema);

module.exports = User;