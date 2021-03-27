//     Student name: Jianchang (Robin) YU
//     student number: 160210191
//     student email: jyu205@myseneca.ca
//     assignment: assignment 2 for web322
//     date: 14 Feb. 2021
//     version 2: 3 March 2021
//     all the styles are in the public/css/style.css
//     all the js files are in the public/js directory with the name of pageName.js


//import all libraries ->
const express=require("express");
const exphbs=require("express-handlebars");
const bodyParser = require('body-parser');
//import mongoose to connect to the mongoDB atlas database
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

//import session
const session = require('express-session');

//import the enviroment variable
//require('dotenv').config({path:'config/key.env'});
//dotenv.config({ path: "./config/keys.env" });

//import local module fakeDb 
const movies = require("./model/FakeDB");

//import your router objects
const userRoutes = require("./controllers/User");
const movieRoutes = require("./controllers/Movie");
const generalRoutes = require("./controllers/General");

const app = express();
// <-import all libraries
 
// default options
app.use(fileUpload());

//which template engine is used in this project
app.engine('handlebars',exphbs(    {
    helpers:{
        is_movie:function(type){
            if(type==="movie")
                return "selected";
        },
        is_TV:function(type){
            if(type==="TV")
                return "selected";
        },
        is_featured:function(featured){
            if(featured==="yes")
                return "selected";
        },
        not_featured:function(featured){
            if(featured==="no")
                return "selected";
        }
    }

}));
app.set('view engine', 'handlebars');

// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

//which static routes are
app.use(express.static("public"));

// create application/x-www-form-urlencoded parser

//this is to allow specific forms and links that were submitted to send PUT and DELETE request respectively
app.use((req,res,next)=>{
    if(req.query.method==='PUT'){
        req.method="PUT";
    }
    else if(req.query.method==="DELETE"){
        req.method="DELETE";
    }
    next();
})

//set up session middleware
app.use(session({
  secret: `${process.env.SECRET_KEY}`,
  resave: false,
  saveUninitialized: true
}))

//set up locals using session
app.use((req,res,next)=>{
    res.locals.user=req.session.userInfo;
    next();
})

//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/movie",movieRoutes);
app.use("/",(req,res)=>{
    const path=__dirname+"/views/General/404.html";
    res.sendFile(path);
});



mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log(`Connected to MongoDB database`)})
.catch(error=>console.log(`Errors when trying to connect to mongoBD because of ${error}`))

//define the port used for this application
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Web page is listenning on port: ${PORT}`);
})



// Reference
//     css and js are from bootstrap.com
//     footer code is from mdbootstrap.com/
//     All movie pictures are from douban.com/
//     All icons are from material.io/resources/icons/?style=baseline