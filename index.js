require('dotenv');
const express=require('express');
const app=express();
const hbs=require('hbs');
const path=require('path');
const port=8000||process.env.PORT;



var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect((err)=>{
    if(err){
        console.log('Database connection error'+err.message);
        process.exit(1);
    }
    console.log("Connected to the database");
});

app.get("/",(req,res)=>{
    res.sendFile(file);
});


app.get("/home",(req,res)=>{
    res.sendFile(file);
});

app.get("/About Us",(req,res)=>{
    res.send(" Working on it ");
});

app.get("/signin", async (req, res) => {
    const { firstname, lastname, email, password } = req.query;
    const queryObject = {};
  
    if (firstname) {
      queryObject.firstname = firstname;
    }
    if (lastname) {
      queryObject.lastname = lastname;
    }
    if (email) {
      queryObject.email = email;
    }
    if (password) {
      queryObject.password = password;
    }
  
    if (queryObject.firstname !== undefined) {
      const values = [queryObject.firstname, queryObject.lastname, queryObject.email, queryObject.password];
      const sql = "INSERT INTO tabledata (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
      fname=queryObject.firstname;
      con.query(sql, values, function (err, result) {
        if (err) {
          console.log(err);
          res.send("Error occurred during database insertion.");
        } else {
          console.log("1 record inserted");
          res.render("form", {
            Name:`${queryObject.firstname}`,
            channelName: `${queryObject.firstname}`,
          });
        }
      });
    } else {
      res.sendFile(signfile);
    }
  });

  app.get("/quiz",(req,res)=>{
    
  });
  
app.get("/login",(req,res)=>{
    res.sendFile(loginfile);

});

app.listen(port,()=>{
    console.log(`the file is onpening at http://localhost:${port}`);
});