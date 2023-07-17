const User = require("../model/user");
const Appointment = require("../model/appointment");

module.exports.schedule = (req, res) => {
  User.find(
    { appointmentType: { $in: ["g", "g2"] }, userType: "Driver" },
    (error, users) => {
      if (users.length > 0) {
        console.log("scheduled Users found");
        res.render("schedule", { session: req.session, user: users });
      } else {
        console.log("no scheduled users found");
        res.render("schedule", { session: req.session, user: [] });
      }
    }
  );
};

module.exports.scheduledDriver = async (req, res) => {
  const { user } = req.body;
  let foundUser;
  await User.find({ userName: user }, (error, users) => {
    if (users.length > 0) {
      foundUser = users[0];
      console.log(foundUser);
      Appointment.find({ _id: foundUser.appointmentId }, (err, appointment) => {
        if (err) {
          console.log("error finding the appointment ", err);
          return;
        }
        if (appointment.length != 0) {
          return res.render("scheduledDriver", {
            session: req.session,
            user: foundUser,
            appointment: appointment[0],
          });
        } else {
          return console.log("no appointment");
        }
      });
    } else {
      console.log("no scheduled users found");
      return res.render("scheduledDriver", {
        session: req.session,
        user: [],
        appointment: [],
      });
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
};

module.exports.addResult = (req, res) => {
  const { userId, comment, result } = req.body;
  console.log(comment);
  console.log(userId);
  User.updateOne(
    { _id: userId },
    {
      $set: {
        comment: comment,
        testResult: result,
      },
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.log("Error finding the User", err);
      } else if (user == null) {
        console.log("User not found", user);
      } else {
        console.log("Comment/result added successfully");
      }
    }
  );
  res.redirect("/examiner/schedule");
};
