//Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Youtube_C"

    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
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