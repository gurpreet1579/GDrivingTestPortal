const User = require('../model/user');

module.exports.g = (req, res) => {
    res.render('g', {
        user: '',
        foundUser: 'User not yet searched'
    });
};

module.exports.getUserByLicense = (req, res) => {
    let licenseNumber = req.body.licenseNumber;

    User.findOne({ "licenseNumber": licenseNumber }, (err, user) => {
        if (err) {
            console.log("Error fetching the user");
        } else if (user == null) {
            console.log("No user found");
        } else {
            console.log("User found", user);
            return res.render('g', {
                user: user,
                foundUser: 'User Found'
            });
        }
        return res.render('g', {
            user: '',
            foundUser: 'No User Found'
        });
    })

}