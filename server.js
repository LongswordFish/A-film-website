//     Student name: Jianchang (Robin) YU
//     student number: 160210191
//     student email: jyu205@myseneca.ca
//     assignment: assignment 2 for web322
//     date: 14 Feb. 2021
//     version 2: 3 March 2021

const express=require("express");
const exphbs=require("express-handlebars");
const bodyParser = require('body-parser');

//import local module fakeDb 
const movies = require("./model/FakeDB");
const { response } = require("express");

const app = express();
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

app.get("/register",(req,res)=>{
    res.render("register",{
        title : "register",
        signedIn:false,
    });
});

app.get("/signIn",(req,res)=>{
    res.render("signIn",{
        title : "signIn",
        signedIn:false,
    });
});

//route for home page
app.post("/sendMSG",(req,res)=>{

    // res.setHeader('Access-Control-Allow-Origin','*');

    //if the register page is posted
    if(req.body.form_name==="register"){

        //declare local variables 
        const {name,password,email}=req.body;
        let error_0=false, error_1=false, error_2=false, error_3=false;

        //check if the name is empty
        if(name===""){
            error_0=true;
        }
        //check if the password is valid
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
        //if not all fields are valid
        if(error_0||error_1||error_2||error_3){
            res.render("register",{
                title : "register",
                signedIn:false,
                name:name,
                password:password,
                email:email,
                is_error_0:error_0,
                is_error_1:error_1,
                is_error_2:error_2,
                is_error_3:error_3,
            })
        }
        //if all fields are valid
        else{
            res.render("home",{
                title : "home",
                signedIn:false,
                featuredMovies: movies.getFeaturedMovies(),
                featuredTVs: movies.getFeaturedTVs(),
                crimes: movies.getCrimes()
            });
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


//route for movieDetail
app.get("/movies/:id",(req,res)=>{
    res.render("movieDetail",{
        title:"movieDetail",
        movie: movies.getMovie(req.params.id)
    });
})

//route for movieListing 
app.get("/listing/:type",(req,res)=>{

    const type= req.params.type;
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



