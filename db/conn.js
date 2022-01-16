const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentreg",{
    useNewUrlParser: true,
    useUnifiedTopology: true}
    ).then(()=>{
        console.log("successfully connected");
    }).catch((e)=>{
        console.log("Error in connecting to database");
    });



