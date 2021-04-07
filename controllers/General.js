const express = require('express')
const router = express.Router();

const movies = require("../model/FakeDB");
const movieModel = require('../model/Movie');
/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",async(req,res)=>{

    try{
        const returnedFeaturedMovies=await movieModel.find({type:'movie',featured:true});
        const featuredMovies=returnedFeaturedMovies.map((film)=>{
            const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=film;
                return {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}
        });

        const returnedFeaturedTVs=await movieModel.find({type:'TV',featured:true});
        const featuredTVs=returnedFeaturedTVs.map((film)=>{
            const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=film;
                return {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}
        });

        const returnedCrimes=await movieModel.find({movie_type:'Crime'});
        const crimes=returnedCrimes.map((film)=>{
            const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=film;
                return {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}
        });

        res.render("General/home",{
            title : "home",
            featuredMovies,
            featuredTVs,
            crimes
        });
    }
    catch(error){
        console.log(`error happened because of ${error}`);              
    }

})

module.exports=router;