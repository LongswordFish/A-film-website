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
})

//route for movieDetail
router.get("/movies/:id",(req,res)=>{
    res.render("Movie/movieDetail",{
        title:"movieDetail",
        movie: movies.getMovie(req.params.id)
    });
})

module.exports=router;