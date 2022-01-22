const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const Student = require("../model/studentSchema");
const axios = require("axios");
const { response } = require("express");
const bodyParser = require("body-parser");
const Result = require("../model/resultSchema");

route.get("/", (req, res) => {
  res.render("index");
});
route.get("/register", (req, res) => {
  res.render("register");
});
route.get("/studentdb", async (req, res) => {
  //make a get request to /api/students
  axios
    .get("http://localhost:8000/api/students")
    .then(function (response) {
      res.render("studentdb", {
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
      console.log(data);
      res.render("firstYear", { result: data });
    }
  });
});

module.exports = route;
