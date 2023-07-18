const User = require('../model/user');

// this middleware is to check if user is present or not , and userType must be driver
// if yes then next()
// else redirect to home or login
module.exports = async (req, res, next) => {
    
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
          return res.redirect('/login');
        } else if (req.session.userType !== 'Driver') {
          return res.redirect('/');
        }
        next();
      } catch (error) {
        // Handle any errors that occur during the query or processing
        console.error(error);
        return res.redirect('/login');
      }
}
