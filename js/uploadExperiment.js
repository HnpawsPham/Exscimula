
import { findData, saveToStorage } from "./firebase.js";

const fields = document.getElementsByClassName("field");
const submitBtn = document.getElementById("submit");
const workNameInput = document.getElementById("work-name");
const topicSelector = document.getElementById("topic");
const gradeSelector = document.getElementById("grade");
const descriptionInput = document.getElementById("description");
const coverImgReview = document.getElementById("cover-img");
const coverImgInput = document.getElementById("cover-img-input");
const returnBtn = document.getElementById("return");
const copyBtns = document.querySelectorAll(".copy-icon");

let accountID = sessionStorage.getItem("accountID");
let isLoggedIn = sessionStorage.getItem("isLoggedIn");

let accountList = await findData("accountList");
let currentAccount = accountList[accountID];

let allUserWork = await findData("allUserWork");

let htmlFile = [];
let assets = {};
let audios = {};
let coverImg = [];

// RETURN TO PROFILE PAGE
returnBtn.addEventListener("click", function () {
    window.location.href = "./profile.html"
})

async function readHTML(file) {
    let fr = new FileReader();
    fr.onload = async function () {
        htmlFile.push(fr.result);
    }

    fr.readAsText(file);
}

// GET BASE 64
function getBase64(file, type) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

        switch (type) {
            case "asset":
                let assetName = file.name.split(".")[0];
                assets[`${assetName}`] = reader.result;
                break;

            case "audio":
                let audioName = file.name.split(".")[0];
                audios[`${audioName}`] = reader.result;
                break;

            case "cover-img":
                coverImg.push(reader.result);
                coverImgReview.src = reader.result;
                break;

            default:
                break;
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

// VISIBLE FILES NAME ON CHOSEN FIELDS
async function loadFilesName(arr, field, type) {
    field.getElementsByTagName("p")[0].innerHTML = "";

    // RESET ARRAY
    switch (type) {
        case "asset":
            assets = {};
            break;
        case "audio":
            audios = {};
            break;
        default:
            break;
    }

    // APPEND ON HTML FILE & PUSH DATA TO ARRAY
    for (let file of arr) {
        let p = document.createElement("p");

        if (file.name.length < 20) {
            p.innerHTML = file.name;
        }
        else {
            p.innerHTML = file.name.substring(0, 17) + "...";
        }

        // CSS STYLE
        field.style.flexDirection = "column";
        field.style.justifyContent = "space-evenly";
        field.style.alignItems = "center";
        field.getElementsByTagName("p")[0].appendChild(p);

        // GET BASE 64 FROM INPUTS
        if (field.id != "code") {
            getBase64(file, field.id);
        }
        else {
            readHTML(file)
        }

    }
}

// READ FILE AFTER INPUT FIELD CHANGED
for (let field of fields) {
    field.addEventListener("change", function (e) {
        const fileList = e.target.files;

        loadFilesName(fileList, field, field.id);
    })
}


// RESET AFTER UPLOADED SUCCESSFULLY
function reset() {
    workNameInput.value = "";
    gradeSelector.value = "topic";
    coverImgReview.src = "";
    descriptionInput.value = "";

}

// CHECK IF UPLOAD INFO IS VALID
function checkValidInfo(){
    if (workNameInput.value.trim().length > 0) {
        if (topicSelector.value != "topic" && gradeSelector.value != "grade") {
            if (htmlFile != null && assets != {}) {
                // SAVE TO DATABASE
                let newWork = {
                    name: workNameInput.value,
                    topic: topicSelector.value,
                    grade: gradeSelector.value,
                    cover_img: coverImg,
                    description: descriptionInput.value,
                    html: htmlFile[0],
                    assets: assets,
                    audios: audios,
                    isVerified: false,
                    indexInAll: allUserWork.length,
                }

                try {
                    currentAccount.work.push(newWork);
                }
                catch {
                    currentAccount["work"] = [newWork];
                }

                reset();

                accountList[accountID] = currentAccount;

                allUserWork.push({
                    title: newWork.name,
                    topic: newWork.topic,
                    desb: newWork.description,
                    grade: newWork.grade,
                    author: {
                        id: currentAccount.index,
                    },
                    html: htmlFile[0],
                    work_index_in_userList: currentAccount.work.length - 1,
                    isVerified: newWork.isVerified
                })

                saveToStorage("accountList", accountList);
                saveToStorage("allUserWork", allUserWork);

                alert("Upload successfully");
                return;

            }
            else {
                alert("Invalid number of HTML files (Must be 1) or no assets founded");
                return;
            }
        }
    }
    alert("Please fill all necessary information");
}

// SUBMIT AND POST EXPERIMENT TO STORAGE
submitBtn.addEventListener("click", function () {
    if (isLoggedIn) {
        // check permission
        if (!accountList[accountID].isBlocked) {
            checkValidInfo();
        }
        else{
            alert("You have been blocked!");
        }
    }
    else {
        alert("You must log in to upload");
    }

})

// UPLOAD COVER IMAGE
coverImgInput.addEventListener("change", function (e) {
    coverImg = [];

    const file = e.target.files[0];
    getBase64(file, "cover-img");
})

// COPY EXAMPLE CODES
for (let copyBtn of copyBtns) {
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(copyBtn.parentElement.querySelector("pre").innerHTML);

        alert("Copied!");
    })
}
