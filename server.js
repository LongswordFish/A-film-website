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
    console.log("home route")
    res.render("home",{
        title : "home",
        featuredMovies: movies.getFeaturedMovies(),
        featuredTVs: movies.getFeaturedTVs(),
        crimes: movies.getCrimes()
    });
})



app.get("/sendMSG",(req,res)=>{
    console.log("msg got")
    res.render("sendMSG",{
        title : "sendMSG",
        featuredMovies: movies.getFeaturedMovies(),
        featuredTVs: movies.getFeaturedTVs(),
        crimes: movies.getCrimes()
    });

});


//route for home page
app.post("/sendMSG",(req,res)=>{
    console.log(`the name of the post it ${req.body.name}`);

    res.setHeader('Access-Control-Allow-Origin','*');

    let error_0="", error_1="", error_2="";
    if(req.body.name==="") 
        error_0="Name is required!";
    if(req.body.password==="")
        error_1="Password is required!";
    if(req.body.email==="")
        error_2="Email is required!";
    if(error_0!==""||error_1!==""||error_2!==""){
        res.render("sendMSG",{
            is_error_0:true,
            error_1:error_1,
            error_2:error_2,
        })
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



