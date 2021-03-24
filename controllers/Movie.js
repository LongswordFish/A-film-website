const express =require('express');
const router = express.Router();
const movierModel=require('../model/Movie');
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
        title:"add"
    });
});


//route for adding movie
router.post("/add",(req,res)=>{
    res.render("Movie/add",{
        title:"add"
    });
});


//route for viewing add movies
router.get("/viewAll",(req,res)=>{
    res.render("Movie/viewAll",{
        title:"viewAll"
    });
});


module.exports=router;