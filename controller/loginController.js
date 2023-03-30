// render login page
module.exports.login = (req, res) => {
    res.render('login', { session: req.session });
}