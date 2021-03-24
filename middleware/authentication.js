const isLoggedIn=(req,res,next)=>{

    if(req.session.userInfo){
        next();
    }
    else{
        res.redirect("/user/signIn");
    }
}

module.exports=isLoggedIn;