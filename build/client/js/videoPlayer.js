"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var playBtnIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteBtnIcon = muteBtn.querySelector("i");
var volumeRange = document.getElementById("volume");
var currentTime = document.getElementById("currentTime");
var totalTime = document.getElementById("totalTime");
var timeline = document.getElementById("timeline");
var fullScreenBtn = document.getElementById("fullScreen");
var fullScreenIcon = fullScreenBtn.querySelector("i");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var controlsMovementTimeout = null;
var controlsTimeout = null;
var volumeValue = 0.5;
var timelineOnClick = 0;
video.volume = volumeValue;

var setControlsTimeout = function setControlsTimeout(to) {
  controlsMovementTimeout = setTimeout(hideControls, to);
};

var clearControlsTimeout = function clearControlsTimeout() {
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
};

var changePlayStatus = function changePlayStatus() {
  if (video.paused) {
    video.play();
    setControlsTimeout(10);
  } else {
    video.pause();
    videoControls.classList.add("showing");
    setControlsTimeout(1000);
  }

  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

var handlePlay = function handlePlay(e) {
  changePlayStatus();
};

var videoClick = function videoClick(e) {
  changePlayStatus();
};

var changeMute = function changeMute() {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

var handleMute = function handleMute(e) {
  changeMute();
};

var handleVolumeRange = function handleVolumeRange(e) {
  var _event = event,
      value = _event.target.value;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "mute";
  }

  volumeValue = value;
  video.volume = value;
};

var formatTime = function formatTime(seconds) {
  if (video.duration < 3600) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
};

var handleLoadedMetadata = function handleLoadedMetadata() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

var handleTimeUpdate = function handleTimeUpdate() {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));

  if (!timelineOnClick) {
    timeline.value = Math.floor(video.currentTime);
  }
};

var handleTimelineOnclick = function handleTimelineOnclick(e) {
  timelineOnClick = 1;
};

var handleTimelineChange = function handleTimelineChange(e) {
  var _event2 = event,
      value = _event2.target.value;
  video.currentTime = value;
  timelineOnClick = 0;
};

var handleFullScreen = function handleFullScreen(e) {
  var fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

var hideControls = function hideControls() {
  videoControls.classList.remove("showing");
};

var handleMouseMove = function handleMouseMove() {
  if (controlsTimeout) {
    clearControlsTimeout();
  }

  if (controlsMovementTimeout) {
    clearControlsTimeout();
  }

  videoControls.classList.add("showing");
  setControlsTimeout(1000);
};

var handleMouseLeave = function handleMouseLeave() {
  setControlsTimeout(1000);
};

var keyboardShort = function keyboardShort(e) {
  // console.log("keyboard event "+e.which);
  if (e.which == 32) {
    changePlayStatus();
  }
};

var handleEnded = function handleEnded() {
  var id = videoContainer.dataset.id;
  fetch("/api/videos/".concat(id, "/view"), {
    method: "POST"
  });
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata); //video.addEventListener("loadeddata", handleLoadedMetadata);

video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("mousedown", handleTimelineOnclick);
timeline.addEventListener("mouseup", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", videoClick);
document.addEventListener("keypress", keyboardShort);
video.addEventListener("ended", handleEnded);