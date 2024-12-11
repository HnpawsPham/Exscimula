import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import moment from 'https://cdn.skypack.dev/moment';
import { delData, getData, setData } from "./firebase.js";
import { forkOff, getDate } from "./auth/storing.js"
import { visibleNoti } from "./notification.js";

const adminName = document.getElementById("admin-name");
const userTable = document.getElementById("user-table");
const commentTable = document.getElementById("comment-table");
const workTable = document.getElementById("work-table");
const popup = document.getElementById("popup");

const auth = getAuth();

const works = await getData(`works/`);

auth.onAuthStateChanged(async (res) => {
    if (!res) forkOff();

    const UID = res.uid;
    const data = await getData(`users/`);

    if (!data[UID].role) forkOff();

    adminName.innerHTML = `Welcome, ${data[UID].name}`;
    loadUsers(data);
    loadComments();
    loadWorks();
})

async function sendEmail(user, info) {
    try {
        const res = await fetch("http://localhost:3000/send-block-email", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                message: info.reason,
                time: info.time.text,
            })
        });

        const data = await res.json();
        if (!res.ok) console.error("sent failed");
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

// Custom option blocking an user
async function blockHandle(btn, user, blocked) {
    if (!blocked) {
        popup.classList.remove("hidden");

        popup.onsubmit = async function (e) {
            e.preventDefault();
            // Collect block info
            let today = moment();
            let date_extension = document.querySelector("#popup>select").value;
            let date_split = date_extension.split(' ');
            console.log(date_split);

            let block = {
                reason: document.querySelector("#popup>select").value,
                time: {
                    text: date_extension,
                    until: today.clone().add(parseInt(date_split.shift()), date_split.pop()).format("DD/MM/YYYY"),
                }
            }
            console.log(block);

            try {
                const data = await sendEmail(user, block);

                if (data){ 
                    await setData(`users/${user.uid}/activities/is_blocked/`, block);
                    visibleNoti("Blocked successfully", 3000);
                    btn.innerHTML = "Unblock this user";
                }
            }
            catch (err) {
                visibleNoti("Blocked unsuccessfully. Please try again.", 4000);
                throw new Error(err);
            }
        }
        return;
    }

    popup.classList.add("hidden");
    try {
        await delData(`users/${user.uid}/activities/is_blocked`);
        visibleNoti("Unblocked successfully");
        btn.innerHTML = "Block this user";
    }
    catch (err) {
        visibleNoti("Unblocked unsuccessfully. Please try again.", 4000);
        throw new Error(err);
    }
}

function loadUsers(data) {
    let cnt = 0;
    for (let user of Object.values(data)) {
        let tr = document.createElement("tr");
        cnt++;

        let index = document.createElement("td");
        index.innerHTML = cnt;
        tr.appendChild(index);

        let name = document.createElement("td");
        name.innerHTML = user.name;
        tr.appendChild(name);

        let email = document.createElement("td");
        email.innerHTML = user.email;
        tr.appendChild(email);

        let password = document.createElement("td");
        password.innerHTML = user.pass;
        tr.appendChild(password);

        let role = document.createElement("td");
        role.innerHTML = user.role;
        tr.appendChild(role);

        let td = document.createElement("td");
        let delBtn = document.createElement("button");
        delBtn.innerHTML = "Delete user";
        td.appendChild(delBtn);

        let isBlocked = user.is_blocked ?? false;
        let blockBtn = document.createElement("button");

        if (!isBlocked) blockBtn.innerHTML = "Block this user";
        else blockBtn.innerHTML = "Unblock this user";

        blockBtn.onclick = async () => await blockHandle(blockBtn, user, isBlocked);

        td.appendChild(blockBtn);
        tr.appendChild(td);

        userTable.appendChild(tr);
    }
}

// Load <td></td> info of a comment
function loadCommentTD(comment, cnt) {
    let tr = document.createElement("tr");
    cnt++;

    let index = document.createElement("td");
    index.innerHTML = cnt;
    tr.appendChild(index);

    let from = document.createElement("td");
    from.innerHTML = comment.from.slice(0, 10) + "...";
    tr.appendChild(from);

    let content = document.createElement("td");
    content.innerHTML = comment.content;
    tr.appendChild(content);

    let date = document.createElement("td");
    date.innerHTML = comment.date;
    tr.appendChild(date);

    let td = document.createElement("td");

    let delCommentBtn = document.createElement("button");
    delCommentBtn.innerHTML = "Delete comment";
    td.appendChild(delCommentBtn);

    let blockBtn = document.createElement("button");
    blockBtn.innerHTML = "Block this user";
    td.appendChild(blockBtn);
    tr.appendChild(td);

    commentTable.appendChild(tr);
}

function loadComments() {
    for (let work of Object.values(works)) {
        let questions = work.questions ?? {};
        let rates = work.rates ?? {};
        let cnt = 0;

        for (let ques of Object.values(questions))
            loadCommentTD(ques, cnt);

        for (let rate of Object.values(rates))
            loadCommentTD(rate, cnt);
    }
}

function loadWorks() {
    let cnt = 0;
    for (let work of Object.values(works)) {
        let tr = document.createElement("tr");
        cnt++;

        let index = document.createElement("td");
        index.innerHTML = cnt;
        tr.appendChild(index);

        let author = document.createElement("td");
        author.innerHTML = work.author.uid.slice(0, 10) + "...";
        tr.appendChild(author);

        let preview = document.createElement("td");
        preview.innerHTML = work.name;
        preview.style.cursor = "pointer";
        preview.onclick = () => window.location.href = `/preview?id=${work.id}&subject=${work.subject}`;
        tr.appendChild(preview);

        let date = document.createElement("td");
        date.innerHTML = work.date;
        tr.appendChild(date);

        let td = document.createElement("td");
        let delBtn = document.createElement("button");
        delBtn.innerHTML = "Delete";
        td.appendChild(delBtn);
        tr.appendChild(td);

        workTable.appendChild(tr);
    }
}

// AP DUNG EMAIL JS GUI EMAIL CHO NGUOI DUNG KHI XOA COMMENT, SIM 