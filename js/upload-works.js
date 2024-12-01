import { getData, setData, updateData_list } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { forkOff, getDate, loadPreviewImg, unZip } from "./auth/storing.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const tagInp = document.querySelector("#form>.tag-inp>input");
const tagsContainer = document.querySelector("#form>.tags-container");
const form = document.querySelector("#form");
const simNameInp = document.querySelector("#form>.sim-name>input");
const descInp = document.querySelector("#form>.desc>input");
const previewImgInput = document.querySelector(".preview-img-inp");
const previewImgContainer = document.querySelector("#form>.img-preview");
const fileInput = document.querySelector(".zip-inp");
const filePreview = document.querySelector("#form>.file-preview");
let tags = [];
let previewImgs = [];
let srcCode = null;
let subject = "chemis";

// GET USER INFO
const auth = getAuth();
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        await visibleNoti("Please log in to contribute.", 3000);
        return;
    }
    const UID = user.uid;

    // Get current user data
    const curUser = await getData(`users/${UID}`) || null;
    if (!curUser) forkOff();

    // Get ids and user point
    let workId = 0;
    if (curUser.works) workId = Object.keys(curUser.works).length;
    let userPoint = curUser.activities.point;

    inputTag();
    inputPreviewImg();
    inputSrc();
    uploadSim(curUser, workId, userPoint);
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

// INPUT PREVIEW IMAGES
function inputPreviewImg() {
    previewImgInput.addEventListener("change", async function () {
        const files = previewImgInput.files;

        if (files.length > 5) {
            visibleNoti("You can only upload maximum of 5 files.", 3000);
            return;
        }
        previewImgs = await loadPreviewImg(files, previewImgContainer, previewImgs);
    })
}

// INPUT TAGS
function inputTag() {
    tagInp.addEventListener("keydown", (e) => {
        if (e.key != " ") return;
        

        if (tagInp.value.trim().length > 0) {
            let content = tagInp.value.trim();

            let div = document.createElement("div");
            div.classList.add("tag");

            let i = document.createElement("i");
            i.innerHTML = content;
            div.appendChild(i);

            let x = document.createElement("span");
            x.innerHTML = "x";

            x.addEventListener("click", function () {
                tagsContainer.removeChild(div);
            })

            tags.push(content);

            div.appendChild(x);
            tagsContainer.appendChild(div);
        }
        else tagsContainer.replaceChildren();

        tagInp.value = "";
    });
}


// INPUT SIM INFO
function inputSrc() {
    fileInput.addEventListener("change", async function (e) {
        const file = e.target.files[0];

        if (file.size > 524288000) {
            visibleNoti("File is too large!", 2000);
            return;
        }

        try {
            srcCode = file;
            filePreview.replaceChildren();
            const data = await unZip(file);

            for (let elm of data.fname) {
                let p = document.createElement("p");
                p.innerHTML = elm;
                filePreview.appendChild(p);
            }
        }
        catch (err) {
            console.log(err.message);
            visibleNoti("There was an error occur. Please try again.", 5000);
        }
    })
}

// UPLOAD SIM HANDLE
async function uploadSim(curUser, id, point) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if(!srcCode){
            visibleNoti("Please upload your code (.zip) first!", 3000);
            return;
        } 

        try {
            const work = {
                name: simNameInp.value,
                date: getDate(),
                description: descInp.value,
                id: ++id,
                author: {
                    name: curUser.name,
                    uid: curUser.uid,
                },
                preview: previewImgs,
                star: {
                    rate_times: 0,
                    value: 0,
                },
                subject: subject,
                tags: tags,
                zip: srcCode
            }
            
            await updateData_list(`users/${curUser.uid}/works`, id);
            await setData(`works/${id}`, work);
            await setData(`users/${curUser.uid}/activities/point`, ++point);

            visibleNoti("Uploaded successfully!", 2000);
        }
        catch (err) {
            console.log(err.message);
            visibleNoti("There was an error occur. Please try again.", 5000);
        }
    })
}