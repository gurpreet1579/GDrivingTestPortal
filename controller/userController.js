const User = require('../model/user');
const bcrypt = require('bcrypt');

// here exists all user releated controls

// render sign-up page for user 
module.exports.signUp = (req, res) => {
  res.render('signUp', { session: req.session });
}

// during signUp creatUser is used to create new user
// it validate entries and redirect to login page if signUp successfull
module.exports.createUser = async (req, res) => {
    const { userName, password, confirmPassword , userType } = req.body;
    try {
        
        // check if any field is empty
        if ( !userName || !password || !confirmPassword || !userType) {
          return res.render('signUp', { emptyFieldError:'Please fill in all fields',session: req.session });
        }
        // check if username already exists in the database
        const userExist = await User.findOne({ userName });
        if (userExist) {
          return res.render('signUp', { userNameError:'User already exist. Try another one',session: req.session });
          // return res.status(409).json({ error: 'Username already exists' });
        }else if( password != confirmPassword  ){
          return res.render('signUp', { passwordError:'Password not same. Try again', session: req.session });
        }
    
        // create a new user object
        const user = new User({ userName, password, userType });
    
        // save the user to the database
        await user.save();
    
        // send to login page
        return res.redirect("/login");
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    return  res.redirect("/login");
}

// when user logIn session is created and stored in local browser
// userId and userType is stored
// if user is first time logging redirect to g2 with message to update information
module.exports.createSession = (req , res) =>{
  const { username, password } = req.body;
  if ( !username || !password ) {
    return res.render('login', { emptyFieldError:'Please fill in all fields',session: req.session });
  }
  User.findOne({userName:username}, (error,user) => {
  if (user) {
    bcrypt.compare(password, user.password, (error, same) =>{
    if(same){ 
      req.session.userId = user._id;
      req.session.userType = user.userType;
      req.session.save();

      let firstTimeLoginMessage='';
      if( user.firstName == 'default')
        firstTimeLoginMessage = 'Update your personal and car information';
      res.render('g2' , { updateInfoMessage: firstTimeLoginMessage , session: req.session } );
    } else { 
      res.render('login' , { passwordError: 'Incorrect Password' , session: req.session } );
    }
    });
  } else {
    res.render('login' , { usernameError: 'No User Found. Please Sign Up' , session: req.session } );
  }
 });
}

// on logout session is deleted
module.exports.destroySession = ( req,res ) => {
  req.session.destroy();
  res.redirect('/home');
}
