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

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'youtube-clone-rpf511/videos',
    Condition: {
        StringEquals: {
        "s3:x-amz-acl": ["public-read"],
        },
    }
    // acl : "public-read",
});

const s3ImageUploader = multerS3({
    s3:s3,
    bucket: 'youtube-clone-rpf511/images',
    Condition: {
        StringEquals: {
        "s3:x-amz-acl": ["public-read"],
        },
    }
    // acl : "public-read",
});

const isHeroku = process.env.NODE_ENV === "production";

console.log(isHeroku);


export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Youtube_C"

    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.isHeroku = isHeroku;
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
    storage : isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({ 
    dest:"uploads/videos/", 
    limits:{
        fileSize: 100000000,
    },
    storage : isHeroku ? s3VideoUploader : undefined,
});