const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const movieSchema= new Schema({
    movie_title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    movie_type:{
        type:String,
        required:true
    },
    price_to_rent:{
        type:Number,
        required:true
    },
    price_to_purchase:{
        type:Number,
        required:true
    },
    small_picture:{
        type:String,
        required:true
    },
    larger_picture:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true 
    },
    featured:{
        type:Boolean,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    createdBy:{

    }

});

const movieModel=mongoose.model('Movies',movieSchema);
module.exports=movieModel;