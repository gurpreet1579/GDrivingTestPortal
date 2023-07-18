const User = require('../model/user');
const Appointment = require('../model/appointment');

module.exports.appointment = (req, res) => {
    res.render('appointment' ,{ session: req.session });
}

module.exports.createSlot =  (req, res ) =>{
    const { date , time} = req.body;
    if(!time){
        return res.render('appointment', { slotMessage :  "Please select time slot" , session: req.session } );
    }
    Appointment.find( { date:date , time:time} , (err , appointment)=>{
        if(err) {
            console.log('error finding the appointment ', err); 
            return;
         }
         if( appointment.length == 0  ){
            const newAppointment = new Appointment({ date, time});
            // save the appointment to the database
            newAppointment.save();
            return res.render('appointment', { slotMessage :  "Appointment slot added successfully" , session: req.session } );
        }else{
          return  res.render('appointment', { slotMessage : 'Appointment slot already present. Choose another one' , session: req.session } );
        }
    });
}


module.exports.getPotentialSlot = (req, res ) =>{

    var timeSlots = [ '09:00' ,'09:30', '10:00', '10:30', '11:00', '11:30', '12:00','12:30', '13:00', '13:30', '14:00' ];
    const date = req.query.date;

    Appointment.find( { "date" : date  } , (err , appointment)=>{
        if(err) {
            console.log('Error finding the appointment ', err); 
            return;
         }
         if( appointment.length != 0  ){
            for (var i = 0; i < appointment.length; i++) {
                var slot = appointment[i];
                timeSlots.splice( timeSlots.indexOf(slot.time)  , 1);
                console.log("Potential Appointment found on this date and found timeslots: ", timeSlots );
              }
             
            }
            res.json({
                success: true,
                message: 'Availability retrieved successfully',
                data: {
                    potentialSlots: timeSlots
                }
            });
    });
}

module.exports.getTestResult = async (req, res) => {
    await User.find( (error, users) => {
        if (users.length > 0) {
            return res.render('result', { session: req.session, users: users });
        } else {
          console.log('no scheduled users found');
          return res.render('result', { session: req.session, users: [] });
        }
      }).clone().catch(function(err){ console.log(err)});
     
}