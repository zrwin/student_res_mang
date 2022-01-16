const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const ejs = require("ejs");
const app = express();
require("./db/conn");
const Student = require("./server/model/studentSchema");
const User = require("./models/schema");
const port = process.env.PORT || 8000;
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

const static_path = path.join(__dirname, "../public/");
app.use(express.static(static_path));

app.set("view engine", "ejs");

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//app.set("views", template_path);
app.use("/css", express.static(path.resolve(__dirname, "public/css")));
app.use("/img", express.static(path.resolve(__dirname, "public/img")));
app.use("/js", express.static(path.resolve(__dirname, "public/js")));

//load routers for studentddb
app.use("/", require("./server/routes/router"));

app.post("/studentdb", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name, password });
  if (!user) {
    req.flash("error_msg", "Invalid Username/Password");

    res.redirect("/");
  } else {
    res.redirect("/studentdb");
  }
});

app.post("/register", async (req, res) => {
  try {
    let password = req.body.password;
    let confirmpas = req.body.confirmpas;
    const username = req.body.name;
    let useremail = req.body.email;
    const userCheck = await User.findOne({ name: username });
    if (password === confirmpas && userCheck == null) {
      const user1 = new User({
        name: username,
        password: password,
        confirmpas: confirmpas,
        email: useremail,
      });
      User.insertMany(user1);

      req.flash("success_msg", "Successfully Registered!");
      res.redirect("/register");
    } else if (password != confirmpas) {
      req.flash("error_msg", "Passwords didn't matched");
    } else if (userCheck != null) {
      req.flash("error_msg", "Username/Email already exists");

      res.redirect("/register");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/search-student", (req, res) => {
  console.log(req.body.query);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
