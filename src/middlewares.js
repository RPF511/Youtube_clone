export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Youtube_C"

    res.locals.loggedIn = Boolean(req.session.loggedIn);

    next();
}