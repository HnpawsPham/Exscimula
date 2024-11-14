import { saveToStorage,findData } from "./firebase.js";

let container = document.getElementById("commentList");
const form = document.getElementById("form");
const content = document.getElementById("content");

let isLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn"));
let accountID = sessionStorage.getItem("accountID");

let commentList = await findData("commentList");
let accountList = await findData("accountList");

form.addEventListener("submit",function(e){
    if(isLoggedIn == true && isLoggedIn != null){

        if(!accountList[accountID].isBlocked){
            if(content.value.trim() != 0){
                let date = new Date();
                date = date.toLocaleDateString()
    
                commentList.push({
                    text: content.value,
                    date: date,
                    critic: accountList[accountID].email,
                    critic_index: accountList[accountID].index
                })
    
                saveToStorage("commentList",commentList);
            }
        }
        else{
            alert("You have been blocked!");
        }
    }
    else{
        e.preventDefault();

        alert("You must log in to comment");
        window.location.href = "../pages/login.html";
    }
})


for (let comment of commentList) {
    let mess = document.createElement("div");
    mess.innerHTML = comment.text;
    mess.classList.add("mess");

    let date = document.createElement("i");
    
    if(accountList[comment.critic_index].name){
        date.innerHTML = accountList[comment.critic_index].name + " • " + comment.date;
    }
    else{
        date.innerHTML = "Anonymous • " + comment.date;
    }

    mess.appendChild(date);

    container.appendChild(mess);
}