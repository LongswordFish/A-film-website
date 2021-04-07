const userModel=require('../../model/User');
const bcrypt=require('bcryptjs');

const signInValidation=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        let error_0="", error_1="",error_2="";
    
        //check if the username is empty
        if(email===""){
            error_0="Email is required!";
        }
        //check if the password is empty
        if(password===""){
            error_1="password is required!";
        }
        //if anything is wrong
        if(error_0||error_1){
            res.render("User/signIn",{
                title : "signIn",
                email:email,
                password:password,
                error_0,
                error_1
            })
        }
        else{
            //check if the username and the password matches what on the database
            const user = await userModel.findOne({email:email});

            //if the email is not in the database
            if(user==null){
                error_2="Sorry, the email or the password is wrong.";
                res.render("User/signIn",{
                    title : "signIn",
                    email:email,
                    password:password,
                    error_0,
                    error_1,
                    error_2
                });
            }
            //if the email is in the datebase
            else{
                //check if the password matches 
                const isMatched = await bcrypt.compare(req.body.password, user.password);
                //if matches
                if (isMatched) {
                    //set session userInfo
                    req.session.userInfo = user;
                    //go to profile page
                    next();

                }
                //if the password doesn't match
                else {
                    error_2="Sorry, the email or the password is wrong.";
                    res.render("User/signIn",{
                        title : "signIn",
                        email:email,
                        password:password,
                        error_0,
                        error_1,
                        error_2
                    });
                }
            }

        }

    }
    catch(error){
        console.log(error);
    }
}

module.exports=signInValidation;