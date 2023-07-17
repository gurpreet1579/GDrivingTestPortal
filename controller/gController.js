const User = require("../model/user");

module.exports.g = async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await User.findOne({ _id: userId }); // Execute the query using findOne instead of find

    if (user) {
      return res.render("g", { session: req.session, user: user });
    } else {
      return res.render("g", { session: req.session });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).send("Internal Server Error"); // Handle the error appropriately
  }
};

//  on g page user have option to update user from default values
module.exports.updateGDriver = (req, res) => {
  const userId = req.session.userId;

  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        licenseNumber: req.body.licenseNumber,
        age: req.body.age,
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
        console.log("Error updating user:", err);
        return res.render("g", {
          user: null,
          updateMessage: "User update unsuccessful. Try again",
          session: req.session,
        });
      }
      if (!updatedUser) {
        console.log("User not found");
        return res.render("g", {
          user: null,
          updateMessage: "User not found",
          session: req.session,
        });
      }

      console.log("Updated user:", updatedUser);
      return res.render("g", {
        user: updatedUser,
        updateMessage: "User updated successfully",
        session: req.session,
      });
    }
  );
};
