const User = require('../model/user');

module.exports = async (req, res, next) => {
    await User.findById(req.session.userId, (error, user ) =>{
    if(error || !user )
        return res.redirect('/login');
    next();
})
}
