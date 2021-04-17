const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const orderSchema= new Schema({
    items:{
        type:Array,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    createdBy:{
        type:String,
        required:true
    }

});

const orderModel=mongoose.model('Order',orderSchema);
module.exports=orderModel;