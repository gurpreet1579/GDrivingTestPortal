const User = require('../model/user');
const Appointment = require('../model/appointment');
const bcrypt = require('bcrypt');

// here exists all user releated controls

// render sign-up page for user 
module.exports.signUp = (req, res) => {
  res.render('signUp', { session: req.session });
}

// during signUp creatUser is used to create new user
// it validate entries and redirect to login page if signUp successfull
module.exports.createUser = async (req, res) => {
    const { userName, password, confirmPassword , userType } = req.body;
    try {
        
        // check if any field is empty
        if ( !userName || !password || !confirmPassword || !userType) {
          return res.render('signUp', { emptyFieldError:'Please fill in all fields',session: req.session });
        }
        // check if username already exists in the database
        const userExist = await User.findOne({ userName });
        if (userExist) {
          return res.render('signUp', { userNameError:'User already exist. Try another one',session: req.session });
          // return res.status(409).json({ error: 'Username already exists' });
        }else if( password != confirmPassword  ){
          return res.render('signUp', { passwordError:'Password not same. Try again', session: req.session });
        }
    
        // create a new user object
        const user = new User({ userName, password, userType });
        console.log(req.body);
        // save the user to the database
        await user.save();
    
        // send to login page
        return res.redirect("/login");
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    return  res.redirect("/login");
}

// when user logIn session is created and stored in local browser
// userId and userType is stored
// if user is first time logging redirect to g2 with message to update information
module.exports.createSession = (req , res) =>{
  const { username, password } = req.body;
  if ( !username || !password ) {
    return res.render('login', { emptyFieldError:'Please fill in all fields',session: req.session });
  }
  User.findOne({userName:username}, (error,user) => {
  if (user) {
    bcrypt.compare(password, user.password, (error, same) =>{
    if(same){ 
      req.session.userId = user._id;
      req.session.userType = user.userType;
      req.session.save();

      let firstTimeLoginMessage='';
      if( user.firstName == 'default')
        firstTimeLoginMessage = 'Update your personal and car information';
      if( user.userType === 'Driver' )
        res.render('g2' , { updateInfoMessage: firstTimeLoginMessage , session: req.session } );
      else if(user.userType === 'Admin')
      res.render('appointment' , { updateInfoMessage: firstTimeLoginMessage , session: req.session } );
    } else { 
      res.render('login' , { passwordError: 'Incorrect Password' , session: req.session } );
    }
    });
  } else {
    res.render('login' , { usernameError: 'No User Found. Please Sign Up' , session: req.session } );
  }
 });
}

// on logout session is deleted
module.exports.destroySession = ( req,res ) => {
  req.session.destroy();
  res.redirect('/home');
}

// find all avaialable slots on given date
module.exports.getSlot = async ( req,res ) => {
  const date = req.query.date;
  let timeSlots = [];
 await Appointment.find( { date:date } , (err , appointment)=>{
    if(err) {
        console.log('error finding the appointment ', err); 
        return;
     }
     if( appointment.length != 0  ){
      for (var i = 0; i < appointment.length; i++) {
        var slot = appointment[i];
        if( slot.isTimeSlotAvailable ){
          timeSlots.push(slot.time);
        }
      }
      // console.log("Appointment found on this date and found timeslots: ", timeSlots );
      }
      // Return the availability array as a JSON response
         res.json({
          success: true,
          message: 'Availability retrieved successfully',
          data: {
            availability: timeSlots
          }
    });     

}).clone().catch(function(err){ console.log(err)});


}

module.exports.addSlot = async (req, res) => {
  const { date, time } = req.body;

  // find the id of selected_slot
    let appointmentID =[];
    await Appointment.find( { "date":date, "time":time } , (err , appointment)=>{
      if(err) {
          console.log('error finding the appointment ', err); 
          return;
       }
       if( appointment.length != 0  ){
          appointmentID.push( appointment[0]._id);
        }else{
        return console.log('no appointment for this date' , date);
      }
  }).clone().catch(function(err){ console.log(err)});


  const userId = req.session.userId;
    User.updateOne( { _id: userId },
        { $set: {
          appointmentId: appointmentID[0]
        }},
        {new: true},
        (err, user) => {
        if (err) {
            console.log("Error finding the User", err);
        } else if (user == null) {
            console.log("User not found", user);
        } else {
          console.log('Appointment booked successfully');
          Appointment.updateOne( { _id: appointmentID[0] },
            { $set: {
              isTimeSlotAvailable: false,
            }},
            {new: true},
            (err, user) => {
              if(!err)
                console.log( 'slot filled ' );
              else{
                return console.log('Error reserving the slot');
              }
            });
            return res.render('g2', {
                user: user,
                bookingMessage: 'Appointment booked successfully',
                session: req.session 
            });
        }
        console.log('Appointment booked unsuccessfull');
        return res.render('g2', {
            user: '',
            bookingMessage: 'Appointment booking unsuccessfull. Try again',
            session: req.session 
        });
    });;

}