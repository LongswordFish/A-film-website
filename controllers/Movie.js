const express =require('express');
const router = express.Router();
const movieModel=require('../model/Movie');
const path=require('path');

const movies = require("../model/FakeDB");

//route for movieListing 
router.get("/listing/:type",(req,res)=>{

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

    res.render("Movie/movieListing",{
        title:"movieListing",
        movies: films
    });
});

//route for movieDetail
router.get("/movies/:id",(req,res)=>{
    res.render("Movie/movieDetail",{
        title:"movieDetail",
        movie: movies.getMovie(req.params.id)
    });
});

//route for adding movie
router.get("/add",(req,res)=>{
    res.render("Movie/add",{
        title:"add",
        success:""
    });
});


//route for adding movie
router.post("/add",async (req,res)=>{
    var {movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured}=req.body;
    let error_0="", error_1="",error_2="",error_3="",error_4="",error_5="",success="";
    if(!movie_title) error_0="movie title is required";
    if(!movie_type) error_1="movie type is required";
    if(!price_to_rent) error_2="price to rent is required";
    if(!price_to_purchase) error_3="price to purchase is required";
    if(!description)error_4="description is required";
    if(!req.files) error_5="Files are required";
    else{
        if(!req.files.small_picture) error_5="small picture is required";
        if(!req.files.large_picture) error_5="large picture is required";
    }
    if(error_0||error_1||error_2||error_3||error_4||error_5){
        res.render("Movie/add",{
            title:"add",
            error_0,
            error_1,
            error_2,
            error_3,
            error_4,
            error_5,
            movie_title,
            type,
            movie_type,
            price_to_rent,
            price_to_purchase,
            description,
            featured,
            success
        })
    }
    else{
        //build a new movieObject
        const newMovie = {
            movie_title,
            type,
            movie_type,
            price_to_rent,
            price_to_purchase,
            description,
            featured
        };

        //build a new modeled movieobject using the movieObejct
        const movie = new movieModel(newMovie);

        try {
            //save the new modeled userobject 
            let returnMovie = await movie.save();
            console.log('add movie accomplished');

            //create a new variable "fileName" used for update
            var small_pic_name = "", large_pic_name="";

            small_pic_name=`movie_pic_${returnMovie._id}${path.parse(req.files.small_picture.name).ext}`;
            req.files.small_picture.mv(`public/upload/${small_pic_name}`);
            large_pic_name=`movie_pic_${returnMovie._id}${path.parse(req.files.large_picture.name).ext}`;
            req.files.large_picture.mv(`public/upload/${large_pic_name}`);

            // update the profilePic attribute data of the users who has the same _id
            // note: ** model.updateOne return how many document been modified
            // not a user object
            let nModified=await movieModel.updateOne({ _id: returnMovie._id }, { F: small_pic_name,large_picture:large_pic_name });
            if(nModified!=0){
                success="Adding movie done!"
                res.render("Movie/add",{
                    title:"add",
                    success
                })
            }
        }
        catch (error) {
            console.log(` ${error}`);
        }
    }
});


//route for viewing add movies
router.get("/viewAll",(req,res)=>{
    movieModel.find()
    .then((returnMovies)=>{

        const movies=returnMovies.map((movie)=>{
            const {movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=movie;
            return {
                movie_title,
                type,
                movie_type,
                price_to_rent,
                price_to_purchase,
                description,
                featured,
                small_picture,
                large_picture
            }
        });
        res.render("Movie/viewAll",{
            title:"viewAll",
            movies
        });
    })
    .catch(error=>console.log(`Error during reading from database: ${error}`));
});


module.exports=router;