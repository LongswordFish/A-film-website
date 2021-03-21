const express = require('express')
const router = express.Router();

/*GENERAL ROUTES*/
//Route to direct user to home page
app.get("/",(req,res)=>{
    res.render("General/home",{
        title : "home",
        signedIn:false,
        featuredMovies: movies.getFeaturedMovies(),
        featuredTVs: movies.getFeaturedTVs(),
        crimes: movies.getCrimes()
    });
})

module.exports=router;