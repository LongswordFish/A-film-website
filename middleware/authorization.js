const isAdmin=(req,res,next)=>{

    if(req.session.userInfo.userType=="admin"){
        next();
    }
    else{
        res.redirect("/user/profile");
    }
}

module.exports=isAdmin;