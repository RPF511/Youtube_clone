//Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
});

const multerUploader = multerS3({
    s3: s3,
    bucket: 'youtube-clone-rpf511-uploader',
});

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
        req.flash("error", "Log In First");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req,res,next) =>{
    if(!req.session.loggedIn){
        return next();
    } else{
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
};



export const avatarUpload = multer({ 
    dest:"uploads/avatars/",
    limits:{
        fileSize: 3000000,
    },
    storage : multerUploader,
});
export const videoUpload = multer({ 
    dest:"uploads/videos/", 
    limits:{
        fileSize: 100000000,
    },
    storage : multerUploader,
});