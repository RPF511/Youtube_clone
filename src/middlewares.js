//Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Youtube_C"

    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    //console.log(res.locals.loggedInUser)
    next();
};

export const protectorMiddleware = (req, res, next) => { 
    if(req.session.loggedIn){
        return next();
    } else{
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req,res,next) =>{
    if(!req.session.loggedIn){
        return next();
    } else{
        return res.render("/");
    }
};

export const avatarUpload = multer({ 
    dest:"uploads/avatars/",
    limits:{
        fileSize: 3000000,
    },
});
export const videoUpload = multer({ 
    dest:"uploads/videos/", 
    limits:{
        fileSize: 10000000,
    },
});