import { getData, setData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { forkOff, getImgBase64, unZip } from "./auth/storing.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// GET USER INFO
let UID;
const auth = getAuth();

auth.onAuthStateChanged(async (user) => {
    if(!user) {
        await visibleNoti("Please log in to contribute.", 3000);
        return;
    }
    UID = user.uid;
})

// CHOOSING OPTIONS HANDLE
const optionBtns = document.querySelectorAll("#top>button");

for (let i in optionBtns) {
    try {
        i = parseInt(i);
        let btn = optionBtns[i];

        btn.addEventListener("click", function () {
            btn.classList.add("option-chosen");
            optionBtns[(i + 1) % optionBtns.length].classList.remove("option-chosen");
        });
    }
    catch { }
}

// INPUT COMPRESSED FILE HANDLE
const fileInput = document.querySelector("#container>input");
const filePreview = document.querySelector("#container>.file-preview");

fileInput.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (file.size > 524288000) {
        visibleNoti("File is too large!", 2000);
        return;
    }

    try {
        filePreview.replaceChildren();
        const data = await unZip(file); 

        for(let elm of data.fname){
            console.log(elm)
            let p = document.createElement("p");
            p.innerHTML = elm;
            filePreview.appendChild(p);
        }


        await setData(`users/${UID}/works`);

        visibleNoti("Uploaded successfully!", 2000);
    }
    catch (err) {
        console.log(err.message);
        visibleNoti("There was an error occur. Please try again.", 5000);
    }
    
})