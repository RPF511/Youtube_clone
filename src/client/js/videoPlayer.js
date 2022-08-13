const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls")



let controlsMovementTimeout = null;
let controlsTimeout = null;
let volumeValue = 0.5;
let timelineOnClick = 0;
video.volume = volumeValue;

const setControlsTimeout = (to) => {
    controlsMovementTimeout = setTimeout(hideControls,to);
}

const clearControlsTimeout = () =>{
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
}

const changePlayStatus = () => {
    if(video.paused){
        video.play();
        setControlsTimeout(10);
    }
    else{
        video.pause();
        videoControls.classList.add("showing");
        setControlsTimeout(1000);
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handlePlay = (e) => {
    changePlayStatus();
}

const videoClick = (e) => {
    changePlayStatus();
}

const changeMute = () => {
    if(video.muted){
        video.muted = false;
    }
    else{
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleMute = (e) => {
    changeMute();
}

const handleVolumeRange =(e) => {
    const {
        target: {value},
    } = event;
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "mute";
    }
    volumeValue = value
    video.volume = value;
}

const formatTime = (seconds) => {
    if(video.duration < 3600){
        return new Date(seconds*1000).toISOString().substr(14,5);
    }  else{
        return new Date(seconds*1000).toISOString().substr(11,8);
    }

    
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    if(!timelineOnClick){
        timeline.value = Math.floor(video.currentTime);
    }
}

const handleTimelineOnclick = (e) => {
    timelineOnClick = 1;
}

const handleTimelineChange = (e) => {
    const {
        target: {value},
    } = event;
    video.currentTime = value;
    timelineOnClick = 0;
}

const handleFullScreen = (e) => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () =>{
    videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearControlsTimeout();
    }
    if(controlsMovementTimeout){
        clearControlsTimeout();
    }
    videoControls.classList.add("showing");
    setControlsTimeout(1000);
    
    
};
  
const handleMouseLeave = () => { 
    setControlsTimeout(1000);
};

const keyboardShort = (e) => {
    // console.log("keyboard event "+e.which);
    if(e.which == 32){
        changePlayStatus();
    }
}

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view` , {method : "POST"});
}


playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
//video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("mousedown", handleTimelineOnclick);
timeline.addEventListener("mouseup", handleTimelineChange);
fullScreenBtn.addEventListener("click",handleFullScreen);
videoContainer.addEventListener("mousemove",handleMouseMove);
videoContainer.addEventListener("mouseleave",handleMouseLeave);
video.addEventListener("click", videoClick);
document.addEventListener("keypress", keyboardShort);
video.addEventListener("ended", handleEnded);