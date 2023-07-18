const User = require('../model/user');

// this middleware is to check if user is present or not , and userType must be examiner
// if yes then next()
// else redirect to home or login
module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user ) =>{
    if(error){
        return res.error(error);
    }
    if(!user ){
        return res.redirect('/login');
    }
    else if(req.session.userType !== 'Examiner' )
        return res.redirect('/');
    next();
})
}
