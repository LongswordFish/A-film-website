//import all the libraries needed
const express =require('express');
const router = express.Router();
const userModel=require('../model/User');
const bcrypt=require('bcryptjs');

//import middlewares
const isLoggedIn=require('../middleware/authentication');
const isAdmin=require('../middleware/authorization');
const registerValidation=require('../middleware/registerValidation');
const signInValidation=require('../middleware/signInValidation');
const register=require('../middleware/register');

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
router.post("/register",registerValidation,register.sendEmail,register.sendMSG,async (req,res)=>{ 
    try {

        const { name, password, email, phone } = req.body;

        //create a new user object
        const newUser = {
            name,
            password,
            email,
            phone
        };

        //create a new userModel using the new object
        const user = new userModel(newUser);
        //get the new user
        const returnUser = await user.save();
        req.session.userInfo = returnUser;
        res.redirect(`/user/admin`);
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
router.post("/signIn",signInValidation,async (req,res)=>
{
    res.redirect(`/user/admin`);

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