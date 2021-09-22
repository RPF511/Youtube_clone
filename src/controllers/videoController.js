//import Video, { formatHashtags } from "../models/Video"; 
import Video from "../models/Video"; 

// callback
// Video.find({}, (error, videos) => {
//     console.log("errors", error);
//     console.log("videos", videos);
// });
// return res.render("home", {pageTitle : "Home", videos: []});

export const home = async(req, res) => {
    // promise
    try{
        const videos = await Video.find({}).sort({createdAt:"desc"});
        return res.render("home", {pageTitle : "Home", videos: videos});
    } catch(error){
        return res.status(404).render("server-errors");
    }
    
}
export const watch = async(req, res) => {
    //const id = req.params.id; or
    const { id } = req.params;
    const video = await Video.findById(id);
    //console.log(video);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }
    return res.render("watch", { pageTitle : `${video.title}`, video});
};

export const getEdit = async(req, res) => {
    //const id = req.params.id; or
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }
    return res.render("edit", {pageTitle : `Editing ${video.title}`,video});
};

// export const upload = (req, res) => {
//     return res.render("upload", {pageTitle : "Upload Video", videos: []});
// }; 

export const postEdit = async(req,res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id : id});
    //console.log(req.body);
    if(!video){
        return res.status(404).render("404", {pageTitle:"Video not found"});
    }
    await Video.findByIdAndUpdate(id, {
        //same as title:title since both param name is same
        title, description, 
        hashtags : Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
}; 

export const getUpload = (req,res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async(req,res) => {
    //get req.file.path and change the var name to fileUrl
    const {path: fileUrl} = req.file;
    const {title, description, hashtags} = req.body;
    try{
        await Video.create({
            //title:title same since var name is same
            title,
            fileUrl,
            description,
            hashtags : Video.formatHashtags(hashtags),
        });
    } catch(error){
        //console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video", 
            errorMessage: error._message
        });
    }
    
    //const dbVideo = await video.save();
    //console.log(dbVideo);
    return res.redirect("/");
};

export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
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
        });
        
    }
    return res.render("search", {pageTitle:"Search", videos});
};