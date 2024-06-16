const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator=require('validator');

//require('../db/conn');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
});


employeeSchema.methods.generateAuthToken=async function(){
    try {
        const token=jwt.sign({_id:this._id},"mynameisrahulkumarsingh");
        this.tokens=this.tokens.concat({token});
        await this.save();
        return token;
    } catch (error){
        console.log(`the error part`+error);
    }
};


employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
});


const Register=new mongoose.model("Register",employeeSchema);

//const createDocument=async()=>{
//    try {
//        const Register1=new Register({
//            firstname:" Rohan Kumar ",
//            lastname:" Singh ",
//            email:"rahulthegreatplanner1@gmail.com",
//            password:"Karolytakasss@123"
//        });
//
//        const result=await Register1.save();
//        console.log(result);
//    } catch (error) {
//        console.log(error);
//    }
//}

//createDocument();

module.exports=Register;