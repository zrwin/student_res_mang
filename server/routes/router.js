const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const Student = require("../model/studentSchema");
const axios = require("axios");
const { response } = require("express");
const bodyParser = require("body-parser");

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

//api
route.post("/api/students", controller.create);
route.get("/api/students", controller.find);
route.put("/api/students/:id", controller.update);
route.delete("/api/students/:id", controller.delete);

module.exports = route;
