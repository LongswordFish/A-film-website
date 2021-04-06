const userModel=require('../model/User');

const registerValidation=async (req,res,next)=>{

    try{
        //declare local variables 
        const {name,password,email,phone}=req.body;

        //add phone==0 as a signal of test and pass this flag back to the controller
        var isTest=false;
        if(phone==0) isTest=true;
        req.isTest=isTest;

        let error_0="", error_1="", error_2="", error_3="", error_4="",error_5="";

        //check if the name is empty
        if(name===""){
            error_0="Name is required!";
        }
        //check if the password is valid, at least one lower char, one upper char and a digit are needed
        var passwordTest=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/; 
        if(password.length<8){
            error_1="Password needs to be at least 8 characters";
        }
        else if(!passwordTest.test(password)){
            error_2="At least one upper character, one lower character and one digit are needed";
        }


        //check if the email is valid
        var emailTest=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!emailTest.test(email)){
            error_3="The format of the email is wrong";
        }

        if(!isTest){
            //check if the phone is valid
            var phoneTest=/^(?=.*\d)[^]{10}$/; 
            if(!phoneTest.test(phone)){
                error_4="The 10 digits phone number is needed";
        }
        }


        //check if the email has been registered
        error_5=await userModel.exists({ email: email });
        if(error_5){
            error_5="This email has been registered, please change another email address"
        }

        //if not all fields are valid
        if(error_0||error_1||error_2||error_3||error_4||error_5){
            res.render("User/register",{
                title : "register",
                name,
                password,
                email,
                phone,
                error_0,
                error_1,
                error_2,
                error_3,
                error_4,
                error_5
            })
        }
        else{
            next();
        }
    }
    catch(error){
        console.log(`error happened in registerValidation because of ${error}`);              
    }
}

module.exports=registerValidation;