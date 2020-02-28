const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//passport configuration
require("./config/passport")(passport);


//Database configuration
const db = require("./config/key").MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log("MongoDB is still connected"))
.catch(err => console.log(err));

//all other static pages
app.use(express.static("public"));


//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Route to serve index.html
app.get("/home",  (req, res)=>{
  res.sendFile(__dirname + "/index.html");
})



//add bodyparser
app.use(express.urlencoded ({ extended: false}));

// Express session middleware (gotten from github express session readme page)
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }));

//PassportJS middleware
app.use(passport.initialize());
app.use(passport.session());




  // Connect flash messaging
  app.use(flash());

//Global Variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});


//Routes
app.use("/", require("./routes/front"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, console.log(`Server has started on port ${PORT}`));