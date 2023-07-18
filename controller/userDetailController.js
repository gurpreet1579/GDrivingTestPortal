const User = require("../model/user");

module.exports.user_detail = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();

    if (user) {
      let firstTimeLoginMessage = "";
      if (user.firstName === "default") {
        firstTimeLoginMessage = "Update your personal and car information first!";
      }
      res.render("user-detail", {
        user: user,
        updateInfoMessage: firstTimeLoginMessage,
        session: req.session,
      });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error occurred while fetching user details:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};


module.exports.getUserByLicense = async (req, res) => {
  try {
    let licenseNumber = req.body.licenseNumber;

    const user = await User.findOne({ licenseNumber: licenseNumber }).exec();

    if (user) {
      console.log("User found", user);
      return res.render("user-detail", {
        user: user,
        foundUser: "User Found",
      });
    } else {
      console.log("No user found");
      return res.render("user-detail", {
        user: "",
        foundUser: "No User Found",
      });
    }
  } catch (error) {
    console.error("Error occurred while fetching user by license number:", error);
    res.render("error", { session: req.session, error: "An error occurred" });
  }
};

