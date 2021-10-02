const { set } = require("mongoose");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls")

let controlsMovementTimeout = null;
let controlsTimeout = null;
let volumeValue = 0.5;
let timelineOnClick = 0;
video.volume = volumeValue;


const handlePlay = (e) => {
    if(video.paused){
        video.play();
    }
    else{
        video.pause()
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }
    else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
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
    return new Date(seconds*1000).toISOString().substr(11,8);
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
        fullscreenBtn.innerText = "enter Full Screen";
    } else{
        videoContainer.requestFullscreen();
        fullscreenBtn.innerText = "exit Full Screen";
    }
}

const hideControls = () =>{
    const hideControls = () => videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls,3000);
  };
  
  const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 1000);
  };


playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("mousedown", handleTimelineOnclick);
timeline.addEventListener("mouseup", handleTimelineChange);
fullscreenBtn.addEventListener("click",handleFullScreen);
videoContainer.addEventListener("mousemove",handleMouseMove);
videoContainer.addEventListener("mouseleave",handleMouseLeave);