const express = require("express"); //handles routing, handling requests and views
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); //for modelling, used with mongoDB to provide backend for Nodejs app
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");


const app = express();

//passport configuration
require("./config/passport")(passport);


//Database configuration
const db = require("./config/key").MongoURI;

// Connect to Mongo
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
.then(()=> console.log("MongoDB is still connected"))
.catch(err => console.log(err));

/*app.use(express.static("public"));*/


//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");


app.use(express.static("public"));

    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public", "index.html"));

    });

/*
app.get("/", function (req, res){
  res.sendFile(__dirname + "/index.html");
})
*/


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