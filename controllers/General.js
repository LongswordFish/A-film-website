const express = require('express')
const router = express.Router();

const movies = require("../model/FakeDB");
/*GENERAL ROUTES*/
//Route to direct user to home page
router.get("/",(req,res)=>{
    res.render("General/home",{
        title : "home",
        featuredMovies: movies.getFeaturedMovies(),
        featuredTVs: movies.getFeaturedTVs(),
        crimes: movies.getCrimes()
    });
})

module.exports=router;