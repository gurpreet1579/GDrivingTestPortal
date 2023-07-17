const User = require("../model/user");

module.exports.user_detail = (req, res) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) return res.redirect("/login");
    else {
      let firstTimeLoginMessage = "";
      if (user.firstName == "default")
        firstTimeLoginMessage =
          "Update your personal and car information first!";
      res.render("user-detail", {
        user: user,
        updateInfoMessage: firstTimeLoginMessage,
        session: req.session,
      });
    }
  });
};

module.exports.getUserByLicense = (req, res) => {
  let licenseNumber = req.body.licenseNumber;

  User.findOne({ licenseNumber: licenseNumber }, (err, user) => {
    if (err) {
      console.log("Error fetching the user");
    } else if (user == null) {
      console.log("No user found");
    } else {
      console.log("User found", user);
      return res.render("user-detail", {
        user: user,
        foundUser: "User Found",
      });
    }
    return res.render("user-detail", {
      user: "",
      foundUser: "No User Found",
    });
  });
};
