import "./db"
import "./models/Video";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";


const app = express();
//combined, dev
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+ "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}));

//session must be declared before routers
app.use(
    session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 864000000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);

/*
//check session
app.use((req,res,next) => {
    req.sessionStore.all((error,sessions) => {
        console.log(sessions);
        next();
    });
});
*/

//localsMiddleware must come after session middleware
app.use(localsMiddleware);
app.use("/",rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
//express.static exposes the folder to server
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/api",apiRouter);
export default app;