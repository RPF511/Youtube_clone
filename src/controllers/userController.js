import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const see = (req, res) => res.send("See User");

export const getJoin = (req, res) => res.render("join",{ pageTitle: "Join"});

export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const {name, username,email,password,passwordCheck,location} = req.body;
    let errorMessage = [];
    const exists = await User.exists({$or: [{username},{email}]} );
    if(exists){
        return res.status(400).render("join", { pageTitle, errorMessage:"this username/email is already taken"});
    }
    if(password !== passwordCheck){
        return res.status(400).render("join", { pageTitle, errorMessage:"password does not match"});
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {pageTitle: "Join", errorMessage : error._message});
    }
    
};

export const getLogin = (req, res) => res.render("login",{ pageTitle: "Login"});

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username});
    if (!user){
        return res.status(400).render("login",{pageTitle, errorMessage:"An account with this username doesn't exists."});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login",{pageTitle, errorMessage:"Wrong PassWord."});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req,res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        //allow_signup:false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl)
};

export const finishGithubLogin = async(req,res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers:{
                Accept: "application/json",
            },
        })
    ).json();
    //res.send(JSON.stringify(json));
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers:{
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers:{
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find( (email) => email.primary === true && email.verified === true);
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email});
        if(!user){
            const user = await User.create({
                avatarUrl : userData.avatar_url,
                name : userData.name,
                username : userData.login,
                email : emailObj.email,
                password : "",
                socialOnly : true,
                location : userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else {
        return res.redirect("/login");
    }
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile"});
};

export const postEdit = async(req, res) => {
    const {
        session: {
            user: { _id },
        },
        body:{ name,email,username,location } 
    } = req;

    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location
    }, 
    //without this option, user.findByIdAndUpdate will return old object
    {new: true}
    );
    req.session.user = updatedUser;

    // req.session.user = {
    //     ...req.session.user,
    //     name,
    //     email,
    //     username,
    //     location,
    // };
    return res.redirect("/users/edit");
};

export const remove = (req, res) => res.send("Remove User");

export const search = (req, res) => res.send("Search");

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};