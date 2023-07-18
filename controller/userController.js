const User = require("../model/user");
const Appointment = require("../model/appointment");
const bcrypt = require("bcrypt");

// here exists all user releated controls

// render sign-up page for user
module.exports.signUp = (req, res) => {
  res.render("signUp", { session: req.session });
};

// during signUp creatUser is used to create new user
// it validate entries and redirect to login page if signUp successfull
module.exports.createUser = async (req, res) => {
  const { userName, password, confirmPassword, userType } = req.body;
  try {
    // check if any field is empty
    if (!userName || !password || !confirmPassword || !userType) {
      return res.render("signUp", {
        emptyFieldError: "Please fill in all fields",
        session: req.session,
      });
    }
    // check if username already exists in the database
    const userExist = await User.findOne({ userName });
    if (userExist) {
      return res.render("signUp", {
        userNameError: "User already exist. Try another one",
        session: req.session,
      });
    } else if (password != confirmPassword) {
      return res.render("signUp", {
        passwordError: "Password not same. Try again",
        session: req.session,
      });
    } else if (password.length < 8) {
      return res.render("signUp", {
        passwordError: "Password must be of 8 letters. Try again",
        session: req.session,
      });
    } else {
      // create a new user object
      const user = new User({ userName, password, userType });
      // save the user to the database
      await user.save();
      // send to login page
      return res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
  return res.redirect("/login");
};

// when user logIn session is created and stored in local browser
// userId and userType is stored
// if user is first time logging redirect to g2 with message to update information
module.exports.createSession = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("login", {
      emptyFieldError: "Please fill in all fields",
      session: req.session,
    });
  }
  User.findOne({ userName: username }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id;
          req.session.userType = user.userType;
          req.session.save();

          // let firstTimeLoginMessage = "";
          if (user.userType === "Driver" && user.firstName == "default") {
            let firstTimeLoginMessage =
              "Update your personal and car information";

            res.render("updateUserDetail", {
              updateInfoMessage: firstTimeLoginMessage,
              user: user,
              session: req.session,
            });
            return;
          }
          if (user.userType === "Driver") res.redirect("/g");
          // res.render("g", {
          //   updateInfoMessage: firstTimeLoginMessage,
          //   session: req.session,
          // });
          else if (user.userType === "Admin")
            res.render("appointment", {
              session: req.session,
            });
          else if (user.userType === "Examiner")
            res.redirect("/examiner/schedule");
        } else {
          res.render("login", {
            passwordError: "Incorrect Password",
            session: req.session,
          });
        }
      });
    } else {
      res.render("login", {
        usernameError: "No User Found. Please Sign Up",
        session: req.session,
      });
    }
  });
};

// on logout session is deleted
module.exports.destroySession = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// find all avaialable slots on given date
module.exports.getSlot = async (req, res) => {
  const date = req.query.date;
  let timeSlots = [];
  await Appointment.find({ date: date }, (err, appointment) => {
    if (err) {
      console.log("error finding the appointment ", err);
      return;
    }
    if (appointment.length != 0) {
      for (var i = 0; i < appointment.length; i++) {
        var slot = appointment[i];
        if (slot.isTimeSlotAvailable) {
          timeSlots.push(slot.time);
        }
      }
      // console.log("Appointment found on this date and found timeslots: ", timeSlots );
    }
    // Return the availability array as a JSON response
    res.json({
      success: true,
      message: "Availability retrieved successfully",
      data: {
        availability: timeSlots,
      },
    });
  }).catch(function (err) {
    console.log(err);
  });
};

module.exports.addSlot = async (req, res) => {
  const { date, time, testType } = req.body;

  // find the id of selected_slot
  let selectedSlot = [];
  await Appointment.find({ date: date, time: time }, (err, appointment) => {
    if (err) {
      console.log("error finding the appointment ", err);
      return;
    }
    if (appointment.length != 0) {
      selectedSlot.push(appointment[0]);
    } else {
      return console.log("no appointment for this date", date);
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  const userId = req.session.userId;
  User.updateOne(
    { _id: userId },
    {
      $set: {
        appointmentId: selectedSlot[0]._id,
        appointmentType: testType,
        appointmentTime: selectedSlot[0].time,
        appointmentDate: selectedSlot[0].date
      },
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.log("Error finding the User", err);
      } else if (user == null) {
        console.log("User not found", user);
      } else {
        console.log("Appointment booked successfully");
        Appointment.updateOne(
          { _id: selectedSlot[0]._id },
          {
            $set: {
              isTimeSlotAvailable: false,
            },
          },
          { new: true },
          (err, user) => {
            if (!err) console.log("slot filled ");
            else {
              return console.log("Error reserving the slot");
            }
          }
        );
        return res.render("g", {
          user: user,
          bookingMessage: "Appointment booked successfully",
          session: req.session,
        });
      }
      console.log("Appointment booked unsuccessfull");
      return res.render("g", {
        user: "",
        bookingMessage: "Appointment booking unsuccessfull. Try again",
        session: req.session,
      });
    }
  );
};


module.exports.updateUserDetail = (req, res) => {
  res.render("updateUserDetail", { session: req.session });
};

//  on g page user have option to update user from default values
module.exports.updateGDriver = (req, res) => {
  const userId = req.session.userId;

  // validate register year
  if( !validateCarRegisterYear(req.body.year) ){
    return res.render("updateUserDetail", {
      user: null,
      updateMessage: "Please fill valid register year",
      session: req.session,
    });
  }
  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        licenseNumber: req.body.licenseNumber,
        dob: req.body.dob,
        "carDetails.make": req.body.make,
        "carDetails.model": req.body.model,
        "carDetails.year": req.body.year,
        "carDetails.plateNumber": req.body.plateNumber,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        return res.render("updateUserDetail", {
          user: null,
          updateMessage: "User update unsuccessful. Try again",
          session: req.session,
        });
      }
      if (!updatedUser) {
        return res.render("updateUserDetail", {
          user: null,
          updateMessage: "User not found",
          session: req.session,
        });
      }

      return res.render("updateUserDetail", {
        user: updatedUser,
        updateMessage: "User updated successfully",
        session: req.session,
      });
    }
  );
};



function validateCarRegisterYear(year) {
  const currentYear = new Date().getFullYear();
  const minYear = 1900; 

  if (isNaN(year) || year < minYear || year > currentYear) {
    return false;
  }

  return true;
}