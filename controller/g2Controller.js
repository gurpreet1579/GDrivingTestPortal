const User = require('../model/user');

module.exports.g2 = (req, res) => {
    res.render('g2');
}
module.exports.addG2Driver = (req, res) => {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        licenseNumber: req.body.licenseNumber,
        age: req.body.age,
        dob: req.body.dob,
        carDetails: {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            plateNumber: req.body.plateNumber
        }
    }, (err, newUser) => {
        if (err) {
            console.log("Error creating new User", err);
            return;
        } else {
            console.log("New contact added successfully", newUser);
        }
    });
    return res.redirect('back');
}

module.exports.updateG2Driver = (req, res) => {
    const _id = req.params.id;
    User.findById({ "_id": _id }, (err, user) => {
        if (err) {
            console.log("Error finding the new User", err);
        } else if (user == null) {
            console.log("User not found", user);
        } else {
            user.carDetails.make = req.body.make;
            user.carDetails.year = req.body.year;
            user.carDetails.model = req.body.model;
            user.carDetails.plateNumber = req.body.plateNumber;
            console.log("User Car details updated", user.carDetails);
            user.save();
            return res.render('g', {
                user: user,
                foundUser: 'User Found'
            });
        }
        return res.render('g', {
            user: '',
            foundUser: 'No User Found'
        });
    });
    // User.findOne({
    //     "licenseNumber": req.body.licenseNumber,
    // }, (err, user) => {
    //     if (err) {
    //         console.log("Error finding the new User", err);
    //     } else if (user == null) {
    //         console.log("User not found", user);
    //     } else {
    //         user.carDetails.make = req.body.make;
    //         user.carDetails.year = req.body.year;
    //         user.carDetails.model = req.body.model;
    //         user.carDetails.plateNumber = req.body.plateNumber;
    //         console.log("User Car details updated", user.carDetails);
    //         user.save();
    //         return res.render('g', {
    //             user: user,
    //             foundUser: 'User Found'
    //         });
    //     }
    //     return res.render('g', {
    //         user: '',
    //         foundUser: 'No User Found'
    //     });
    // });

}