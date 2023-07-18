// this middleware is to restrict login page if user is already logged in
module.exports = (req, res, next) =>{
    if(req.session.userId){
        return res.redirect('/') // if user logged in, redirect to home page
    }
    next();
}
    