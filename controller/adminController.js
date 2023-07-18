const User = require('../model/user');
const Appointment = require('../model/appointment');

module.exports.appointment = (req, res) => {
    res.render('appointment' ,{ session: req.session });
}

module.exports.createSlot = async (req, res) => {
    try {
      const { date, time } = req.body;
      
      if (!time) {
        return res.render('appointment', { slotMessage: "Please select a time slot", session: req.session });
      }
  
      const existingAppointment = await Appointment.find({ date: date, time: time });
  
      if (existingAppointment.length === 0) {
        const newAppointment = new Appointment({ date, time });
        await newAppointment.save();
        return res.render('appointment', { slotMessage: "Appointment slot added successfully", session: req.session });
      } else {
        return res.render('appointment', { slotMessage: "Appointment slot already present. Please choose another one", session: req.session });
      }
    } catch (err) {
      console.log('Error finding the appointment', err);
      return res.status(500).render('appointment', { slotMessage: "Internal server error", session: req.session });
    }
  };
  


module.exports.getPotentialSlot = async (req, res) => {
    try {
      const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];
      const date = req.query.date;
  
      const appointments = await Appointment.find({ "date": date });
  
      if (appointments.length !== 0) {
        for (let i = 0; i < appointments.length; i++) {
          const slot = appointments[i];
          const index = timeSlots.indexOf(slot.time);
          if (index !== -1) {
            timeSlots.splice(index, 1);
          }
          console.log("Potential Appointment found on this date and found timeslots: ", timeSlots);
        }
      }
  
      res.json({
        success: true,
        message: 'Availability retrieved successfully',
        data: {
          potentialSlots: timeSlots
        }
      });
    } catch (err) {
      console.log('Error finding the appointment', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  

module.exports.getTestResult = async (req, res) => {
    try {
      const users = await User.find().exec();
  
      if (users.length > 0) {
        return res.render('result', { session: req.session, users: users });
      } else {
        console.log('No scheduled users found');
        return res.render('result', { session: req.session, users: [] });
      }
    } catch (error) {
      console.log(error);
      // Handle the error accordingly
      return res.status(500).send('Internal Server Error');
    }
  };
  