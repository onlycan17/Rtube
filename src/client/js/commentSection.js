import fetch from "node-fetch";
import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
//const videoComments = document.querySelector(".video__comments ul");
let deleteIcon = document.getElementsByClassName("delete_icon");
let editIcom = document.getElementsByClassName("edit_icon");

//console.log(deleteIcon[0]);


const editComment = async(tag,id) => {
    const li = tag.parentNode;
    console.log(li.querySelector("span"));
    const textSpan = li.querySelector("span");
    //console.log(textSpan.innerText);
    const input = document.createElement("input");
    input.setAttribute("id",id);
    input.setAttribute("value",textSpan.innerText);
    const saveBtn = document.createElement("button");
    saveBtn.setAttribute("id",id);
    saveBtn.innerText = "Save";
    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("id","cancel_"+id);
    cancelBtn.innerText = 'Cancel';
    const spanArray = li.querySelectorAll("span");
    spanArray.forEach(element => {
        element.setAttribute("style", "display:none");
    });
    //li.remove();
    li.appendChild(input);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
    saveBtn.addEventListener("click", () => handleEdit(id,input.value,li));
    cancelBtn.addEventListener("click", () => handleCancel(li,id));
}
const handleCancel = (li,id) => {
    const spanArray = li.querySelectorAll("span");
    spanArray.forEach(element => {
        element.setAttribute("style", "display:auto");
    });
    const input = li.querySelector("input");
    const button =  li.querySelectorAll("button");
    input.remove();
    button.forEach(element => {
        element.remove();
    });
}
const handleEdit = async(id, text, li) => {
    console.log(id);
    console.log(id.length);
    const response = await fetch(`/api/videos/${id}/comment`, {
        method: "PATCH",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({text}),
    });
    if(response.status === 200){
        const span = li.querySelector("span");
        span.innerText = text;
        handleCancel(li,id);
    }
}

const handleDelete = async (id) => {
    console.log('id:'+id);
    const response  = await fetch(`/api/videos/${id}/comment`,{method: "get"});
    console.log('status: '+response.status);
    if(response.status === 200){
        const span = document.getElementById(id);
        const li = span.parentNode;
        console.log(li);
        li.remove();
    }
}

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    span2.setAttribute("class","delete_icon");
    span2.setAttribute("id",id);
    const span3 = document.createElement("span");
    span3.innerText = '📝';
    span3.setAttribute("class","edit_icon");
    span3.setAttribute("id","id");
    span3.dataset.id = id;
    //span2.setAttribute("data-id",id);
    console.log(id);
    span2.dataset.id = id;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    newComment.appendChild(span3);
    videoComments.prepend(newComment);
    deleteIcon = document.getElementsByClassName("delete_icon");
    for(let i=0; i< deleteIcon.length; i++){
        //deleteIcon[i].dataset.id = id;
        const id = deleteIcon[i].dataset.id;
        console.log(id); 
        deleteIcon[i].addEventListener("click", () => handleDelete(id));
    }
}

const btn = form.querySelector("button");

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ''){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({text}),
    });
    console.log(status);
    if(response.status === 201){
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

if(form){
    form.addEventListener("submit", handleSubmit);
}


for(let i=0; i< deleteIcon.length; i++){
    const id = deleteIcon[i].dataset.id;
    //console.log(id); 
    deleteIcon[i].addEventListener("click", () => handleDelete(id));
    editIcom[i].addEventListener("click",() => editComment(editIcom[i],id));
}