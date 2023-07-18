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
module.exports.createSession = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render("login", {
        emptyFieldError: "Please fill in all fields",
        session: req.session,
      });
    }

    const user = await User.findOne({ userName: username }).exec();

    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          req.session.userId = user._id;
          req.session.userType = user.userType;
          req.session.save();

          if (user.userType === "Driver" && user.firstName == "default") {
            let firstTimeLoginMessage = "Update your personal and car information";
            return res.render("updateUserDetail", {
              updateInfoMessage: firstTimeLoginMessage,
              user: user,
              session: req.session,
            });
          }

          if (user.userType === "Driver") {
            return res.redirect("/g");
          } else if (user.userType === "Admin") {
            return res.render("appointment", {
              session: req.session,
            });
          } else if (user.userType === "Examiner") {
            return res.redirect("/examiner/schedule");
          }
        } else {
          return res.render("login", {
            passwordError: "Incorrect Password",
            session: req.session,
          });
        }
      });
    } else {
      return res.render("login", {
        usernameError: "No User Found. Please Sign Up",
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error occurred while creating session:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};

// on logout session is deleted
module.exports.destroySession = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// find all avaialable slots on given date
module.exports.getSlot = async (req, res) => {
  try {
    const date = req.query.date;
    let timeSlots = [];
    const appointment = await Appointment.find({ date: date }).exec();

    if (appointment.length !== 0) {
      for (var i = 0; i < appointment.length; i++) {
        var slot = appointment[i];
        if (slot.isTimeSlotAvailable) {
          timeSlots.push(slot.time);
        }
      }
    }

    // Return the availability array as a JSON response
    res.json({
      success: true,
      message: "Availability retrieved successfully",
      data: {
        availability: timeSlots,
      },
    });
  } catch (error) {
    console.error("Error occurred while getting slots:", error);
    res.json({
      success: false,
      message: "Error retrieving availability",
      data: {
        availability: [],
      },
    });
  }
};

module.exports.addSlot = async (req, res) => {
  try {
    const { date, time, testType } = req.body;

    // find the id of selected_slot
    let selectedSlot = [];
    const appointment = await Appointment.find({ date: date, time: time }).exec();

    if (appointment.length !== 0) {
      selectedSlot.push(appointment[0]);
    } else {
      console.log("No appointment for this date", date);
      return res.render("g", {
        user: "",
        bookingMessage: "No appointment available for this date",
        session: req.session,
      });
    }

    const userId = req.session.userId;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          appointmentId: selectedSlot[0]._id,
          appointmentType: testType,
          appointmentTime: selectedSlot[0].time,
          appointmentDate: selectedSlot[0].date,
        },
      },
      { new: true }
    ).exec();

    if (updatedUser) {
      console.log("Appointment booked successfully");
      const updatedSlot = await Appointment.updateOne(
        { _id: selectedSlot[0]._id },
        {
          $set: {
            isTimeSlotAvailable: false,
          },
        }
      ).exec();

      if (!updatedSlot) {
        console.log("Error reserving the slot");
        return res.render("g", {
          user: "",
          bookingMessage: "Error reserving the slot",
          session: req.session,
        });
      }

      return res.render("g", {
        user: updatedUser,
        bookingMessage: "Appointment booked successfully",
        session: req.session,
      });
    } else {
      console.log("Appointment booking unsuccessful");
      return res.render("g", {
        user: "",
        bookingMessage: "Appointment booking unsuccessful. Try again",
        session: req.session,
      });
    }
  } catch (error) {
    console.error("Error occurred while adding slot:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};




module.exports.updateUserDetail = (req, res) => {
  res.render("updateUserDetail", { session: req.session });
};

//  on g page user have option to update user from default values
module.exports.updateGDriver = async (req, res) => {
  try {
    const userId = req.session.userId;

    // validate register year
    if (!validateCarRegisterYear(req.body.year)) {
      return res.render("updateUserDetail", {
        user: null,
        updateMessage: "Please fill valid register year",
        session: req.session,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
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
      { new: true }
    ).exec();

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
  } catch (error) {
    console.error("Error occurred while updating G driver:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};



function validateCarRegisterYear(year) {
  const currentYear = new Date().getFullYear();
  const minYear = 1900; 

  if (isNaN(year) || year < minYear || year > currentYear) {
    return false;
  }

  return true;
}