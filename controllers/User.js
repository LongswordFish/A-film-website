//import all the libraries needed
const express =require('express');
const router = express.Router();
const userModel=require('../model/User');
const bcrypt=require('bcryptjs');
const orderModel=require('../model/Order');
const moment=require('moment');

//import middlewares
const isLoggedIn=require('../middleware/authentication');
const isAdmin=require('../middleware/authorization');
const registerValidation=require('../middleware/user/registerValidation');
const signInValidation=require('../middleware/user/signInValidation');
const register=require('../middleware/user/register');

//const path=require('path');

//import the fake database
const movies = require("../model/FakeDB");
const movieModel = require('../model/Movie');

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
router.post("/signIn",signInValidation,(req,res)=>
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


router.get("/shoppingCart",isLoggedIn,async(req,res)=>{

        res.render("User/shoppingCart", {
            title: "shoppingCart"
        });
    
});

router.get("/clearOrder",isLoggedIn,(req,res)=>{

    req.session.shoppingCart=[];

    res.redirect("/user/shoppingCart");

});

router.get("/confirmOrder",isLoggedIn,async (req,res)=>{

    const total = res.locals.shoppingCart.reduce((prev, cur)=> {
        if(cur.rentOrBuy=="rent")
            return cur.movie.price_to_rent + prev;
        if(cur.rentOrBuy=="buy")
            return cur.movie.price_to_purchase + prev; 
    }, 0);

    
    const items=req.session.shoppingCart;
    const order={items,total,createdBy:req.session.userInfo.email};
    //console.log(order);

    const newOrder=new orderModel(order);
    const returnOrder=await newOrder.save();



    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let msg = {
        to: req.session.userInfo.email, 
        from: 'jyu205@myseneca.ca', // Change to your verified sender
        subject: 'New Order Information',
        text: `${req.session.userInfo.name}, you just ordered a new order`,
        html: `<h2>Hi, ${req.session.userInfo.name}, you just ordered a new order. Enjoy!</h2>`,
    };

    req.session.shoppingCart.map((item)=>{
        
        if(item.rentOrBuy=="rent")
            msg.html+=`<p> ${item.rentOrBuy} the ${item.movie.movie_title} for ${item.movie.price_to_rent}</p>`;
        if(item.rentOrBuy=="buy")
            msg.html+=`<p> ${item.rentOrBuy} the ${item.movie.movie_title} for ${item.movie.price_to_purchase}</p>`;
    });
    msg.html+=`<p>The total of the order is ${total}</p>`;

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        })

    res.redirect("/user/profile/")

});

router.get("/orderListing",isLoggedIn,async(req,res)=>{
    try{
        const returnOrders=await orderModel.find({"createdBy":req.session.userInfo.email});

        //console.log(returnOrders);

        if(returnOrders==null){
            msg="You don't have any orders."
            res.render("User/orderListing",{
                title:"orderListing",
                msg,
            });
        }else{

            const orders=returnOrders.map((order)=>{
                const {_id,dateCreated,total}=order;
                return {_id,dateCreated:moment(dateCreated).format('MMMM Do YYYY, h:mm:ss a'),total};
            });

            
            res.render("User/orderListing",{
                title:"orderListing",
                orders,
            });
        }

    }
    catch(err){console.log(`err is ${err}`);}

});


router.get("/logout/",isLoggedIn,(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});



module.exports=router;