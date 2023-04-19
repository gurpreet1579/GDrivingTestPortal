const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const appointmentSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time:{
        type: String,
        required: true
    },
    isTimeSlotAvailable: {
            type: Boolean,
            default: true,
    },
});

const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;