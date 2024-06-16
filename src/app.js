require('dotenv');
const express=require('express');
const app=express();
const Register=require('./models/register');
const port=8000||process.env.port;
const path=require('path');
const hbs=require('hbs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const auth=require('./middleware/auth');
require('./db/conn');

const viewspath=path.join(__dirname,'../templates/vviews');
console.log(viewspath);
const partialspath=path.join(__dirname,'../templates/partials');
console.log(partialspath);


app.set("view engine","hbs");
app.set("views",viewspath);
hbs.registerPartials(partialspath);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


app.get("/home",async(req,res)=>{
  res.render("home");
});

app.get("/secret",auth,async(req,res)=>{
  console.log(`The cookie present in the test link is known as ${req.cookies.jwt}`);
  res.render('form');
});

app.get("/login",async(req,res)=>{
  res.render("login");
});

app.post("/login",async(req,res)=>{
  try {
    const email=req.body.email;
    const password=req.body.password;
    const usermail = await Register.findOne({email:email});
    console.log(usermail);

    const isMatch=bcrypt.compare(password,usermail.password);

    const token = await usermail.generateAuthToken();
    console.log(`The token part`+token);

    res.cookie('jwt',token,{
      expires:new Date(Date.now()+5000),
      httpOnly:true
    });

    if(isMatch){
      res.status(201).render('testlink',{
        channelName:`${usermail.firstname}`+`${usermail.lastname}`
      });
    }
    else{
      res.send('invalid login details');
    }

    console.log("Logges In Successfully");

  } catch (error) {

    res.status(400).send("Invalid Login Details");

  }

});

app.get("/signin",async(req,res)=>{
  res.render("register");
});

app.post("/signin",async(req,res)=>{
  try {

  const password=req.body.password;
  const confirmpassword=req.body.password;
  if(password==confirmpassword){
    const registerstudent=Register({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password
    });

    const token=await registerstudent.generateAuthToken();
    console.log('The token part'+token);

    res.cookie("jwt",token,{
      expires:new Date(Date.now()+60000),
      httpOnly:true
    });

    const registered = await registerstudent.save();
    console.log(registered);
    res.status(201).render('testlink'); 
  }
  else{
    res.send('Password are not matching');
  }
  } catch (error) {
    console.log(error);
    res.status(201).render(error);
  }
});


app.get('/logout',auth,async(req,res)=>{
  try {

    console.log("entered in logout1");
    console.log(req.user);
    console.log("enter in logout part 2");

    // req.user.tokens=req.user.tokens.filter((currElement)=>{
    //   return currElement.token!=req.token
    // });

    console.log("enter in logout part 3");
    
    req.user.tokens=[];

    res.clearCookie("jwt");

    console.log("logout successfully");

    await req.user.save();

    res.render('login');


  } catch (error) {

    res.status(500).send(error);

  }
})




app.listen(port,(req,res)=>{
  console.log(`Home page  is http://localhost:${port}/home`)
  console.log(`Register page  is http://localhost:${port}/signin`)
  console.log(`Login page known as  http://localhost:${port}/login`);
})






















// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mydb"
// });

// con.connect((err)=>{
//     if(err){
//         console.log('Database connection error'+err.message);
//         process.exit(1);
//     }
//     console.log("Connected to the database");
// });

// app.get("/",(req,res)=>{
//     res.sendFile(file);
// });


// app.get("/home",(req,res)=>{
//     res.sendFile(file);
// });

// app.get("/About Us",(req,res)=>{
//     res.send(" Working on it ");
// });

// app.get("/signin", async (req, res) => {
//     const { firstname, lastname, email, password } = req.query;
//     const queryObject = {};
  
//     if (firstname) {
//       queryObject.firstname = firstname;
//     }
//     if (lastname) {
//       queryObject.lastname = lastname;
//     }
//     if (email) {
//       queryObject.email = email;
//     }
//     if (password) {
//       queryObject.password = password;
//     }
  
//     if (queryObject.firstname !== undefined) {
//       const values = [queryObject.firstname, queryObject.lastname, queryObject.email, queryObject.password];
//       const sql = "INSERT INTO tabledata (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
//       fname=queryObject.firstname;
//       con.query(sql, values, function (err, result) {
//         if (err) {
//           console.log(err);
//           res.send("Error occurred during database insertion.");
//         } else {
//           console.log("1 record inserted");
//           res.render("form", {
//             Name:`${queryObject.firstname}`,
//             channelName: `${queryObject.firstname}`,
//           });
//         }
//       });
//     } else {
//       res.sendFile(signfile);
//     }
//   });

//   app.get("/quiz",(req,res)=>{
    
//   });
  
// app.get("/login",(req,res)=>{
//     res.sendFile(loginfile);

// });

// app.listen(port,()=>{
//     console.log(`the file is onpening at http://localhost:${port}`);
// });