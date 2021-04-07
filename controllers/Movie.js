const express =require('express');
const router = express.Router();
const mongoose = require('mongoose');
const movieModel=require('../model/Movie');
const path=require('path');

const movies = require("../model/FakeDB");
const isLoggedIn = require("../middleware/authentication");
const isAdmin = require('../middleware/authorization');

//route for movieListing 
router.get("/listing/:type",async (req,res)=>{

    const {type}= req.params;

    if(type!='movies' &&type!="TVs" &&type!="all"){
        res.redirect("/");
    }
    else{
        try{
            let films = [];

            if(type=='movies')
            {
                films=await movieModel.find({type:"movie"});
                //films = movies.getMovies()
            }
        
            else if (type=="TVs")
            {
                films=await movieModel.find({type:"TV"});
                //films = movies.getTVs() 
            }
            else if (type=="all")
            {
                films=await movieModel.find({});
                //films = movies.getAllMovies()
            }

            const localFilms=films.map((film)=>{
                const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=film;
                return {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}
            });
        
            res.render("Movie/movieListing",{
                title:"movieListing",
                movies: localFilms
            });
        }catch(errors){
            console.log(`error happens because of ${error}`);
        }

        
    }

});

//route for movieDetail
router.get("/movies/:_id",async (req,res)=>{
    try{
        if( !mongoose.Types.ObjectId.isValid(req.params._id) ){
            res.render("Movie/nothing",{
                title:"nothing",
                msg: "Sorry, no such movie"
            });
        }
        else{

            const isValid=await movieModel.exists({_id: req.params._id});
            if(isValid){
                const returnMovie=await movieModel.findOne({_id:req.params._id});
                const {movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=returnMovie;
                movie={movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}
                res.render("Movie/movieDetail",{
                    title:"movieDetail",
                    movie,
                });
    
            }
            else{
                 res.render("Movie/nothing",{
                    title:"nothing",
                    msg: "Sorry, no such movie"
                });
            }
        }

    }catch(error){
        console.log(`error happens because of ${error}`);
    }

});

//route for adding movie
router.get("/add",isLoggedIn,isAdmin,(req,res)=>{
    res.render("Movie/add",{
        title:"add",
        success:""
    });
});

// router.get("/addAll",(req,res)=>{

//     let newMovies=movies.getAllMovies().map(async(eachMovie)=>{

//         const {title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=eachMovie;
//         const newMovie={
//             movie_title:title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture
//         }
//         const movie = new movieModel(newMovie);
    
//         try {
//             //save the new modeled userobject 
//             return returnMovie=await movie.save();
//         }
//         catch (error) {
//             console.log(` ${error}`);
//         }
//     })

// });

// router.get("/deleteAll",(req,res)=>{
//     movieModel.deleteMany(());
// });


//route for adding movie
router.post("/add",isLoggedIn,isAdmin,async (req,res)=>{
    var {movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured}=req.body;
    let error_0="", error_1="",error_2="",error_3="",error_4="",error_5="",success="";
    if(!movie_title) error_0="movie title is required";
    if(!movie_type) error_1="movie type is required";
    if(!price_to_rent) error_2="price to rent is required";
    else if(isNaN(price_to_rent)) error_2="price to rent has to be a number";
    if(!price_to_purchase) error_3="price to purchase is required";
    else if(isNaN(price_to_purchase)) error_3="price to purchase has to be a number";
    if(!description)error_4="description is required";
    if(!req.files) error_5="Files are required";
    else{
        if(!req.files.small_picture) error_5="small picture is required";
        else{
            let ext=path.parse(req.files.small_picture.name).ext;
            if(ext!=".jpg" && ext!=".gif"&&ext!=".png" &&ext!=".webp"){
                error_5="Only support jpg, gif, png and webp."
            }
        }
        if(!req.files.large_picture) error_5="large picture is required";
        else{
            let ext=path.parse(req.files.large_picture.name).ext;
            if(ext!=".jpg" && ext!=".gif"&&ext!=".png" &&ext!=".webp"){
                error_5="Only support jpg, gif, png and webp."
            }
        }
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

           small_pic_name=`movie_small_pic_${returnMovie._id}${path.parse(req.files.small_picture.name).ext}`;

            large_pic_name=`movie_large_pic_${returnMovie._id}${path.parse(req.files.large_picture.name).ext}`;

            //update the profilePic attribute data of the users who has the same _id
            // note: ** model.updateOne return how many document been modified
            // not a user object
            let nModified=await movieModel.updateOne({ _id: returnMovie._id }, { small_picture:small_pic_name,large_picture:large_pic_name });
           req.files.small_picture.mv(`public/upload/${small_pic_name}`);
            req.files.large_picture.mv(`public/upload/${large_pic_name}`);

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
router.get("/viewAll",isLoggedIn,isAdmin,(req,res)=>{
    movieModel.find()
    .then((returnMovies)=>{

        const movies=returnMovies.map((movie)=>{
            
            const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=movie;
            return {
                _id,
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

//router to delete movie
router.delete("/delete/:_id",isLoggedIn,isAdmin,(req,res)=>{
    console.log("here");
    movieModel.deleteOne({_id:req.params._id})
    .then(()=>{
        console.log("delete");
        res.redirect("/movie/viewAll");
    })
    .catch(error=>console.log(`Error during deleting one document from database: ${error}`));

});


//Route to direct user to edit task form

router.get("/edit/:_id",isLoggedIn,isAdmin,(req,res)=>{

    movieModel.findById(req.params._id)
    .then((movie)=>{
        const {_id,movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured,small_picture,large_picture}=movie;

        console.log(price_to_rent);
        res.render("Movie/edit",{
            _id,
            movie_title,
            type,
            movie_type,
            price_to_rent,
            price_to_purchase,
            description,
            featured,
            small_picture,
            large_picture
        })
    })
    .catch(error=>console.log(`Error during reading one document from database: ${error}`))

});


//Route to update user data after they submit the form
router.put("/edit/:_id",isLoggedIn,isAdmin,(req,res)=>{
    console.log("here");
    const {movie_title,type,movie_type,price_to_rent,price_to_purchase,description,featured}=req.body;
    
    let small_pic_name=`movie_small_pic_${req.params._id}${path.parse(req.files.small_picture.name).ext}`;
    req.files.small_picture.mv(`public/upload/${small_pic_name}`);
    let large_pic_name=`movie_large_pic_${req.params._id}${path.parse(req.files.large_picture.name).ext}`;
    req.files.large_picture.mv(`public/upload/${large_pic_name}`);

    const movie={
        movie_title,
        type,
        movie_type,
        price_to_rent,
        price_to_purchase,
        description,
        featured,
        small_picture:small_pic_name,
        large_pic_name:large_pic_name
    };

    movieModel.updateOne({_id:req.params._id},movie)
    .then(()=>{
        res.redirect("/movie/viewAll");
    })
    .catch(error=>console.log(`Error during updating one document from database: ${error}`));

})

//router to delete movie
router.delete("/delete/:_id",isLoggedIn,isAdmin,(req,res)=>{
    movieModel.deleteOne({_id:req.params._id})
    .then(()=>{
        res.redirect("/movie/viewAll");
    })
    .catch(error=>console.log(`Error during deleting one document from database: ${error}`));

});

module.exports=router;