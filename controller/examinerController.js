const User = require("../model/user");
const Appointment = require("../model/appointment");

module.exports.schedule = async (req, res) => {
  try {
    const users = await User.find({ appointmentType: { $in: ["g", "g2"] }, userType: "Driver" }).exec();
    if (users.length > 0) {
      console.log("Scheduled Users found");
      res.render("schedule", { session: req.session, user: users });
    } else {
      console.log("No scheduled users found");
      res.render("schedule", { session: req.session, user: [] });
    }
  } catch (error) {
    console.error("Error occurred while fetching scheduled users:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};

module.exports.scheduledDriver = async (req, res) => {
  try {
    const { user } = req.body;
    let foundUser;
    const users = await User.find({ userName: user }).exec();

    if (users.length > 0) {
      foundUser = users[0];
      console.log(foundUser);
      const appointment = await Appointment.find({ _id: foundUser.appointmentId }).exec();

      if (appointment.length !== 0) {
        return res.render("scheduledDriver", {
          session: req.session,
          user: foundUser,
          appointment: appointment[0],
        });
      } else {
        console.log("No appointment");
      }
    } else {
      console.log("No scheduled users found");
    }

    return res.render("scheduledDriver", {
      session: req.session,
      user: [],
      appointment: [],
    });
  } catch (error) {
    console.error("Error occurred while fetching scheduled driver:", error);
    return res.render("error", { session: req.session, error: "An error occurred" });
  }
};

module.exports.addResult = async (req, res) => {
  try {
    const { userId, comment, result } = req.body;
    console.log(comment);
    console.log(userId);
    const updatedUser = await User.updateOne(
      { _id: userId },
      {
        $set: {
          comment: comment,
          testResult: result,
        },
      }
    ).exec();

    if (updatedUser.nModified === 1) {
      console.log("Comment/result added successfully");
    } else {
      console.log("User not found");
    }

    res.redirect("/examiner/schedule");
  } catch (error) {
    console.error("Error occurred while adding comment/result:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};
