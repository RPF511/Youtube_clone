const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");



const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span_x = document.createElement("span");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    icon.className = "fas fa-comment";
    span.innerText = ` ${text}`;
    span_x.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span_x);
    videoComments.prepend(newComment);
  };
const  handleSubmit = async (event) =>  {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    console.log(videoId);

    if(text === "" ){return;}

    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({text}),
    });

    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
      }
    // window.location.reload();
};

if(form) {
    form.addEventListener("submit", handleSubmit);
}
