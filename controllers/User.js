const express =require('express');
const router = express.Router();
const userModel=require('../model/User');
const path=require('path');

const movies = require("../model/FakeDB");

//declare a global variable to show in the welcome page
var usernameGlobal="";

//Route to direct user to registration form
router.get("/register",(req,res)=>{
    res.render("User/register",{
        title : "register",
        signedIn:false,
    });
});

//Route to process user's request and data when user submits registration form
router.post("/register",async (req,res)=>{ 
        //declare local variables 
        const {name,password,email,phone}=req.body;
        let error_0=false, error_1=false, error_2=false, error_3=false, error_4=false;

        //check if the name is empty
        if(name===""){
            error_0=true;
        }
        //check if the password is valid, at least one lower char, one upper char and a digit are needed
        var passwordTest=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/; 
        if(password.length<8){
            error_1=true;
        }
        else if(!passwordTest.test(password)){
            error_2=true;
        }

        //check if the email is valid
        var emailTest=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!emailTest.test(email)){
            error_3=true;
        }

        var phoneTest=/^(?=.*\d)[^]{10}$/; 
        if(!phoneTest.test(phone)){
            error_4=true;
        }

        //if not all fields are valid
        if(error_0||error_1||error_2||error_3||error_4){
            res.render("register",{
                title : "register",
                signedIn:false,
                name:name,
                password:password,
                email:email,
                phone:phone,
                is_error_0:error_0,
                is_error_1:error_1,
                is_error_2:error_2,
                is_error_3:error_3,
                is_error_4:error_4,
            })
        }
        //if all fields are valid
        else{
            
            usernameGlobal=name;
            
            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email, // Change to your recipient
                from: 'jyu205@myseneca.ca', // Change to your verified sender
                subject: 'Wlecome to FishStreaming',
                text: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
                html: '<h2>Welcome<h2>',
            };
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
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
                .then(message => console.log(message.sid));
                res.redirect(`/user/profile/${returnUser._id}`); 
        }
})

//Route to direct user to the login form
router.get("/signIn",(req,res)=>{
    res.render("User/signIn",{
        title : "signIn",
        signedIn:false,
    });
});

//Route to direct user to the login form
router.post("/signIn",(req,res)=>
{
    const {username,password}=req.body;
    let error_0=false, error_1=false;

    //check if the username is empty
    if(username===""){
        error_0=true;
    }
    //check if the password is valid
    if(password===""){
        error_1=true;
    }
    //if not all fields are valid
    if(error_0||error_1){
        res.render("signIn",{
            title : "signIn",
            signedIn:false,
            password:password,
            username:username,
            is_error_0:error_0,
            is_error_1:error_1
        })
    }
    //if all fields are valid
    else{
        usernameGlobal=username;
        res.redirect(`/user/profile/${returnUser._id}`);           
    }
});

router.get("/profile/:_id",(req,res)=>{
    userModel.findById(req.params._id)
    .then((user)=>{
        const {profilePic}=user;
        res.render("User/welcome",{
            profilePic
        });
    })
    .catch();
    
});

router.get("/welcome",(req,res)=>{
    res.render("User/welcome",{
        title : "welcome",
        signedIn:true,
        username:usernameGlobal
    });
});

module.exports=router;