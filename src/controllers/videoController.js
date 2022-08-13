//import Video, { formatHashtags } from "../models/Video"; 
import User from "../models/User";
import Video from "../models/Video"; 
import Comment from "../models/Comment"; 

// callback
// Video.find({}, (error, videos) => {
//     console.log("errors", error);
//     console.log("videos", videos);
// });
// return res.render("home", {pageTitle : "Home", videos: []});

export const home = async(req, res) => {
    // promise
    try{
        const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
        return res.render("home", {pageTitle : "Home", videos: videos});
    } catch(error){
        return res.status(404).render("server-errors");
    }
    
}
export const watch = async(req, res) => {
    //const id = req.params.id; or
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    console.log(video);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }
    return res.render("videos/watch", { pageTitle : `${video.title}`, video});
};

export const getEdit = async(req, res) => {
    //const id = req.params.id; or
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }

    const {
        user: {_id}
    }= req.session;
    if(String(video.owner) !== String(_id)){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }

    return res.render("videos/edit", {pageTitle : `Editing ${video.title}`,video});
};

// export const upload = (req, res) => {
//     return res.render("upload", {pageTitle : "Upload Video", videos: []});
// }; 

export const postEdit = async(req,res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;

    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }

    const {
        user: { _id },
    } = req.session;
    if(String(video.owner) !== String(_id)){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }

    await Video.findByIdAndUpdate(id, {
        //same as title:title since both param name is same
        title, description, 
        hashtags : Video.formatHashtags(hashtags),
    });
    req.flash("success", "Changes Saved");
    return res.redirect(`/videos/${id}`);
}; 

export const getUpload = (req,res) => {
    
    return res.render("videos/upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { video, thumb } = req.files;
    console.log(video);
    console.log(thumb);
    // get req.file.path and change the var name to fileUrl
    // const {path: fileUrl} = req.file;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            //title:title same since var name is same
            title,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            description,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        req.flash("success", "Video Uploaded");
        return res.redirect("/");
    } catch(error){
        //console.log(error);
        return res.status(400).render("videos/upload", {
            pageTitle: "Upload Video", 
            errorMessage: error._message
        });
    }
    //const dbVideo = await video.save();
    //console.log(dbVideo);
    
};

export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }

    const {
        user: { _id },
    } = req.session;
    if(String(video.owner) !== String(_id)){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    const currentUser = await User.findById(_id);
    const idx = currentUser.videos ? currentUser.videos.indexOf(id) : -1;
    if(idx!== -1){
        currentUser.videos.splice(idx,1);
    }
    currentUser.save();
    await Video.findByIdAndDelete(id);
    req.flash("success", "Video Deleted");
    return res.redirect("/");
};

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                //mongodb operator
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
        
    }
    return res.render("videos/search", {pageTitle:"Search", videos});
};

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    video.save();
    return res.sendStatus(200);
}


export const createComment = async (req, res) => {
    // console.log(req.params);
    // console.log(req.body);

    // const { id } = req.params;
    // const { text } = req.body;

    const {
        session: {user},
        body: { text },
        params : { id },
    } = req;

    const video = await Video.findById(id);

    if(!video){
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video:id,
    })

    video.comments.push(comment._id);
    video.save();



    return res.sendStatus(201);
}