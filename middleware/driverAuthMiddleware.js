const User = require('../model/user');

// this middleware is to check if user is present or not , and userType must be driver
// if yes then next()
// else redirect to home or login
module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user ) =>{
    if(error || !user ){
        console.log(error);
        return res.redirect('/login');
    }
    else if(req.session.userType !== 'Driver' )
        return res.redirect('/');
    next();
})
}
