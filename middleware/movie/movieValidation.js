
const path=require('path');

const movieValidation= (req,res,next)=>{

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
       next();

    }
}

module.exports=movieValidation;