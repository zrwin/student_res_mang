let Student = require("../model/studentSchema");

//create and save new student
exports.create = (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    email: req.body.email,
    rollno: req.body.roll,
    gender: req.body.gender,
    phone: req.body.phone,
    stream: req.body.stream,
  });

  newStudent
    .save(newStudent)
    .then((data) => {
      req.flash("success_msg", "Succesfully Inserted Student into Database");
      res.redirect("/add-user");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occucred wihile creating new Student",
      });
    });
};

//find all student/single student
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Student.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: "No user found with id:" + id,
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.send(500).send({
          message: "Error retrieving Student with id:" + id,
        });
      });
  } else {
    Student.find()
      .then((newStudent) => {
        res.send(newStudent);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error occurred while retrieving user information",
        });
      });
  }
};

//find and update student details
exports.update = (req, res) => {
  const id = req.params.id;

  Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update student details with ${id}`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error Update Student Information",
      });
    });
};

//Delete a student with specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Student.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id: ${id}`,
        });
      } else {
        res.send({
          message: "Student deleted successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete User with id ${id}`,
      });
    });
};