const User = require('../model/user');

// to render g page, session sent to g2 because it check if user logged in or not then show navigation accordingly 
module.exports.g2 = (req, res) => { 
    res.render('g2', { session: req.session });
}
//  on g2 page user have option to update user from default values
module.exports.updateG2Driver = (req, res) => {
    const userId = req.session.userId;
    User.updateOne( { _id: userId },
        { $set: {
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
        }},
        {new: true},
        (err, user) => {
        if (err) {
            console.log("Error finding the new User", err);
        } else if (user == null) {
            console.log("User not found", user);
        } else {
            return res.render('g2', {
                user: user,
                updateMessage: 'User updated successfully',
                session: req.session 
            });
        }
        return res.render('g2', {
            user: '',
            updateMessage: 'User update unsuccessfull. Try again',
            session: req.session 
        });
    });;

}