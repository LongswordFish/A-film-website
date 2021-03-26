//import all the libraries needed
const express =require('express');
const router = express.Router();
const userModel=require('../model/User');
const bcrypt=require('bcryptjs');
const isLoggedIn=require('../middleware/authentication');
const isAdmin=require('../middleware/authorization');
//const path=require('path');

//import the fake database
const movies = require("../model/FakeDB");

//Route to direct user to registration form
router.get("/register",(req,res)=>{
    res.render("User/register",{
        title : "register"
    });
});

//Route to process user's request and data when user submits registration form
router.post("/register",async (req,res)=>{ 
    try{
        //declare local variables 
        const {name,password,email,phone}=req.body;
        let error_0="", error_1="", error_2="", error_3="", error_4="",error_5="";

        //check if the name is empty
        if(name===""){
            error_0="Name is required!";
        }
        //check if the password is valid, at least one lower char, one upper char and a digit are needed
        var passwordTest=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/; 
        if(password.length<8){
            error_1="Password needs to be at least 8 characters";
        }
        else if(!passwordTest.test(password)){
            error_2="At least one upper character, one lower character and one digit are needed";
        }

        //check if the email is valid
        var emailTest=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!emailTest.test(email)){
            error_3="The format of the email is wrong";
        }

        //check if the phone is valid
        var phoneTest=/^(?=.*\d)[^]{10}$/; 
        if(!phoneTest.test(phone)){
            error_4="The 10 digits phone number is needed";
        }

        //check if the email has been registered
        error_5=await userModel.exists({ email: email });
        if(error_5){
            error_5="This email has been registered, please change another email address"
        }

        //if not all fields are valid
        if(error_0||error_1||error_2||error_3||error_4||error_5){
            res.render("User/register",{
                title : "register",
                name,
                password,
                email,
                phone,
                error_0,
                error_1,
                error_2,
                error_3,
                error_4,
                error_5
            })
        }
        //if all fields are valid
        else{
                       
            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email, // Change to your recipient
                from: 'jyu205@myseneca.ca', // Change to your verified sender
                subject: 'Wlecome to FishStreaming',
                text: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
                html: `<h2>Hi, ${name},welcome to FishStreaming, please enjoy the films<h2>`,
            };
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                })
                .catch((error) => {
                    console.error(error);
                })

            //set up the msg sending by Twiolio API
            const accountSid = process.env.accountSid;
            const authToken = process.env.authToken;
            const client = require('twilio')(accountSid, authToken);

            client.messages
                .create({
                    body: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
                    from: '+12253965782',
                    to: phone
                })
                .then(message => console.log(message.sid))
                .catch(error=>console.log(`error happened during sending msg because of ${error}`));

            //create a new user object
            const newUser={
                name,
                password,
                email,
                phone
            };

            //create a new userModel using the new object
            const user=new userModel(newUser);
            //get the new user
            const returnUser=await user.save();
            req.session.userInfo=returnUser;
            res.redirect(`/user/admin`); 
    }
}   
    catch(error){
        console.log(`error happened during saving new user because of ${error}`);              
    }
})

//Route to direct user to the login form
router.get("/signIn",(req,res)=>{
    res.render("User/signIn",{
        title : "signIn",
    });
});

//Route to direct user to the login form
router.post("/signIn",async (req,res)=>
{
    alert("coming to signIn");
    try{
        const {email,password}=req.body;
        let error_0="", error_1="",error_2="";
    
        //check if the username is empty
        if(email===""){
            error_0="Email is required!";
        }
        //check if the password is empty
        if(password===""){
            error_1="password is required!";
        }
        //if anything is wrong
        if(error_0||error_1){
            res.render("User/signIn",{
                title : "signIn",
                email:email,
                password:password,
                error_0,
                error_1
            })
        }
        else{
            //check if the username and the password matches what on the database
            const user = await userModel.findOne({email:email});

            //if the email is not in the database
            if(user==null){
                error_2="Sorry, the email or the password is wrong.";
                res.render("User/signIn",{
                    title : "signIn",
                    email:email,
                    password:password,
                    error_0,
                    error_1,
                    error_2
                });
            }
            //if the email is in the datebase
            else{
                //check if the password matches 
                const isMatched = await bcrypt.compare(req.body.password, user.password);
                //if matches
                if (isMatched) {
                    //set session userInfo
                    req.session.userInfo = user;
                    //go to profile page
                    res.redirect(`/user/admin`);
                }
                //if the password doesn't match
                else {
                    error_2="Sorry, the email or the password is wrong.";
                    res.render("User/signIn",{
                        title : "signIn",
                        email:email,
                        password:password,
                        error_0,
                        error_1,
                        error_2
                    });
                }
            }

        }

    }
    catch(error){
        console.log(error);
        alert(error);
    }


});

//use isLoggedIn to protect the route
router.get("/profile/",isLoggedIn,(req,res)=>{
    res.render("User/welcome", {
        title: "welcome"
    });
})


//use isLoggedIn to protect the route
//use the isAdmin to protext it from non-admin
// non-admin users will be redirected to the /user/profile
router.get("/admin",isLoggedIn,isAdmin,(req,res)=>{
    res.render("User/admin", {
        title: "admin"
    });
})

router.get("/logout/",(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

module.exports=router;