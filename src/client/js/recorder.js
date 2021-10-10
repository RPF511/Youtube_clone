const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async() => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio:true, 
        video:true,
        // video:{width:200,height:100};
    });
    video.srcObject = stream;
    video.onplay();
};

startBtn.addEventListener("click", handleStart);