const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const Student = require("../model/studentSchema");
const User = require("./../../models/schema");

const axios = require("axios");
const { response } = require("express");
const bodyParser = require("body-parser");
const Result = require("../model/resultSchema");
const async = require("hbs/lib/async");
const { STATES } = require("mongoose");

route.get("/", (req, res) => {
  res.render("main");
});

route.get("/student-loggedin", (req, res) => {
  res.render("studentLoggedIn");
});

route.get("/student-login", (req, res) => {
  res.render("studentLogin");
});

route.post("/student-login", async function (req, res) {
  const { name, password } = req.body;

  const user = await User.findOne({ name, password });
  if (!user) {
    req.flash("error_msg", "Invalid Username/Password");

    res.redirect("/");
  } else {
    Student.findOne({ roll: name }).then((data) => {
      console.log(data);
      res.render("studentLoggedIn", { student: data });
    });
  }
});

route.get("/admin-login", (req, res) => {
  res.render("index");
});

route.get("/register", (req, res) => {
  res.render("register");
});

route.get("/student-register", (req, res) => {
  res.render("studentRegister");
});

route.get("/main", (req, res) => {
  res.render("main");
});

route.get("/menu", (req, res) => {
  //make a get request to /api/students
  axios
    .get("http://localhost:8000/api/students")
    .then(function (response) {
      let totalresult = 0;
      Result.find().then((data) => {
        totalresult = data.length;
        res.render("menu", {
          students: response.data,
          totalstd: response.data.length,
          totresult: totalresult,
        });
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

route.get("/studentdb", async (req, res) => {
  //make a get request to /api/students
  axios
    .get("http://localhost:8000/api/students")
    .then(function (response) {
      res.render("showStudents", {
        students: response.data,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

route.get("/add-user", (req, res) => {
  res.render("add_user");
});

route.get("/update-user", (req, res) => {
  axios
    .get("http://localhost:8000/api/students", {
      params: { id: req.query.id },
    })
    .then(function (response) {
      res.render("update_user", { students: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

route.get("/update-result", (req, res) => {
  axios
    .get("http://localhost:8000/api/results", {
      params: { id: req.query.id },
    })
    .then(function (response) {
      res.render("update_result", { results: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

route.get("/get-result", (req, res) => {
  const querid = req.query.id;
  console.log(querid);
  Result.findById(querid).then((data) => {
    res.render("firstYear", { result: data });
  });
});
route.get("/addResult", (req, res) => {
  res.render("addResult.ejs");
});

route.get("/search-student", (req, res) => {
  res.render("search_student");
});

route.post("/search-student", (req, res) => {
  axios.get("http://localhost:8000/api/students").then(function (response) {
    let allData = response.data;
    let matched = allData.filter((data) => data.name === req.body.query);
    res.render("showStudents", {
      students: matched,
    });
  });
});

route.post("/addResult", (req, res) => {
  const newResult = new Result({
    year: req.body.year,
    rollno: req.body.roll,
    name: req.body.name,
    subject1: req.body.subject1,
    marks1: req.body.marks1,
    totmarks1: req.body.totmarks1,
    subject2: req.body.subject2,
    marks2: req.body.marks2,
    totmarks2: req.body.totmarks2,
    subject3: req.body.subject3,
    marks3: req.body.marks3,
    totmarks3: req.body.totmarks3,
    father: req.body.father,
    stream: req.body.stream,
    gender: req.body.gender,
  });

  newResult
    .save(newResult)
    .then((data) => {
      req.flash("success_msg", "Successfully added student Result in Database");
      res.redirect("/addResult");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occucred wihile adding new Result",
      });
    });
});

//api
route.post("/api/students", controller.create);
route.get("/api/students", controller.find);
route.put("/api/students/:id", controller.update);
route.delete("/api/students/:id", controller.delete);
route.get("/api/results", controller.findResult);
route.put("/api/results/:id", controller.updateResult);
route.delete("/api/results/:id", controller.deleteResult);

route.get("/show-results", async (req, res) => {
  axios
    .get("http://localhost:8000/api/students", {
      params: { id: req.query.id },
    })
    .then(function (response) {
      res.render("showResults", {
        roll: response.data.rollno,
        id: req.query.id,
      });
      // res.render("update_user", { students: response.data });
    });
});

route.get("/studentResult", (req, res) => {
  const id = req.query.id;

  const roll = req.query.roll;
  const studentYear = req.query.year;
  Result.findOne({
    $and: [
      { rollno: roll },
      {
        year: studentYear,
      },
    ],
  }).then((data) => {
    if (!data) {
      const err_message = `No data found having Roll:${roll} for Year:${studentYear}`;
      req.flash("error_msg", err_message);
      res.redirect(`/show-results?id=${id}`);
    } else {
      res.render("firstYear", { result: data });
    }
  });
});

route.get("/all-result", (req, res) => {
  axios.get("http://localhost:8000/api/results").then(function (response) {
    res.render("allResults", { results: response.data });
  });
});

module.exports = route;
