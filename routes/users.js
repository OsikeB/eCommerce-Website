const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport")


//Mongoose works when we create models & call methods on that model
const User = require("../models/User"); //.. means we go ouside routes folder


//Login Page
router.get("/login", (req, res) => res.render ("login"));

//Registration Page
router.get("/register", (req, res) => res.render ("register"));

//Registration handle, after user click register
router.post("/register", (req, res) => {
   const { name, email, password, password2 } = req.body;
   let errors =[];

   //check required fields
   if(!name || !email || !password || !password2) {
       error.push({ msg: "Please fill all fields"});    
   }

// Check if password match
if(password !==password2) {
    errors.push({ msg: "Password doesn't match"});
}

//check password length
if(password.length < 7 ){
    errors.push({ msg: "Password should have at least 7 characters"});

}

//if there is an error, form should be rendered again
if(errors.length > 0){
res.render("register", {
    errors,
    name,
    email,
    password,
    password2

});
}else {

    //To validate user
    User.findOne ({ email: email})
    .then(user => {
        if(user){

            // User exists
            errors.push({ msg: "This email has already been registered"});
            res.render("register", {
                errors,
                name,
                email,
                password,
                password2
            
            });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            
            // Enscrypt password
            bcrypt.genSalt(10, (err, salt)=> 
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;

            //Password set to hash
                    newUser.password = hash;

            //new user saved to mongoDB database and redireced to login page
            newUser.save()
            .then(user => {
                req.flash("success_msg", "You are registered, Please login");
                res.redirect("/users/login");
            })
            .catch(err => console.log(err));


            }))
        }
    });

}

});

//Login handle, after user click login
router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true

    })(req, res, next);

    
});


//Logout Handle
router.get("/logout", (req, res)=> {
    req.logout();
    req.flash("success_msg", "You are now logged out");
    res.redirect("/users/login");
});
module.exports = router;