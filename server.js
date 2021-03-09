//     Student name: Jianchang (Robin) YU
//     student number: 160210191
//     student email: jyu205@myseneca.ca
//     assignment: assignment 2 for web322
//     date: 14 Feb. 2021
//     version 2: 3 March 2021

const express=require("express");
const exphbs=require("express-handlebars");
const bodyParser = require('body-parser');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//import axios
const axios = require('axios').default;

//import local module fakeDb 
const movies = require("./model/FakeDB");
const { response } = require("express");

const app = express();
//declare a global variable to show in the welcome page
var usernameGlobal="";

//which template engine is used in this project
app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');


//which static routes are
app.use(express.static("public"));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended: false}));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })


//routes
//route for home page
app.get("/",(req,res)=>{
    res.render("home",{
        title : "home",
        signedIn:false,
        featuredMovies: movies.getFeaturedMovies(),
        featuredTVs: movies.getFeaturedTVs(),
        crimes: movies.getCrimes()
    });
})

//route for movieListing 
app.get("/listing/:type",(req,res)=>{

    const {type}= req.params;
    let films = [];

    if(type=='movies')
    {
        films = movies.getMovies()
    }

    else if (type=="TVs")
    {
        films = movies.getTVs() 
    }
    else if (type=="all")
    {
        films = movies.getAllMovies()
    }

    res.render("movieListing",{
        title:"movieListing",
        movies: films
    });
})

//route for movieDetail
app.get("/movies/:id",(req,res)=>{
    res.render("movieDetail",{
        title:"movieDetail",
        movie: movies.getMovie(req.params.id)
    });
})


//route for register page
app.get("/register",(req,res)=>{
    res.render("register",{
        title : "register",
        signedIn:false,
    });
});

//route for signIn page
app.get("/signIn",(req,res)=>{
    res.render("signIn",{
        title : "signIn",
        signedIn:false,
    });
});

//route for sendMSG, method=='POST'
app.post("/sendMSG",(req,res)=>{

    res.setHeader('Access-Control-Allow-Origin','*');

    //if the register page is posted
    if(req.body.form_name==="register"){

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
            // let config = {
            //     headers: {
            //         'Authorization': 'Bearer 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',
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Credentials':true,
            //         'Access-Control-Allow-Origin':true
            //     }
            //   };
              
            // let data = {
            //     "personalizations":
            //     [
            //         {"to":
            //             [
            //                 {"email":email,
            //                 "name":name
            //                 }
            //             ],
            //         "subject":"Welcome to FishStreaming"
            //         }
            //     ],
            //     "content": 
            //     [
            //         {"type": "text/plain", 
            //         "value": "Heya!"}
            //     ],
            //     "from":
            //         {"email":"robinyu9840@gmail.com",
            //         "name":"Robin Yu"
            //         },
            //     "reply_to":
            //         {"email":"robinyu9840@gmail.com",
            //         "name":"Robin Yu"
            //         }
            // };

            // axios.post('https://api.sendgrid.com/v3/mail/send',data,config)
            //   .then(function (response) {
            //     console.log(response);
            //   })
            //   .catch(function (error) {
            //     console.log(`error is`,error);
            //   });
            

            // const xhr=new XMLHttpRequest();
            // xhr.open('POST', 'https://api.sendgrid.com/v3/mail/send');
            // xhr.setRequestHeader('Authorization','Bearer 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');
            // xhr.setRequestHeader('Content-Type','application/json');
            // xhr.setRequestHeader("Access-Control-Allow-Credentials", true);
            // xhr.setRequestHeader("Access-Control-Allow-Origin", true);          
            // xhr.send(JSON.stringify(data));
            // xhr.onreadystatechange=()=>{
            //     if(xhr.readyState===4){
            //         console.log('readystate');
            //         if(xhr.status>=200 && xhr.status<300){
            //             console.log('status 200');
            //             console.log(xhr.response);
            //         }
            //     }
            // }

            //set up the msg sending by Twiolio API
            const accountSid = 'AC803866b6ca557f8a93fe85cc66385f8e';
            const authToken = '60a0b9f4d3fa4e90a6747aad857665c7';
            const client = require('twilio')(accountSid, authToken);

            client.messages
                .create({
                    body: `Hi, ${name},welcome to FishStreaming, please enjoy the films`,
                    from: '+12253965782',
                    to: phone
                })
                .then(message => console.log(message.sid));
            res.redirect('/welcome'); 
        }

    } 
    //if the signIn page is posted
    else if(req.body.form_name==="signIn"){
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
            res.redirect('/welcome');           
        }
    }

});



app.get("/welcome",(req,res)=>{
    res.render("welcome",{
        title : "welcome",
        signedIn:true,
        username:usernameGlobal
    });
});

//404 error page
app.use((req, res) => {
    const path=__dirname+"/views/404.html";
    res.sendFile(path);
});





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