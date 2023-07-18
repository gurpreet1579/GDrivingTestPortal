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