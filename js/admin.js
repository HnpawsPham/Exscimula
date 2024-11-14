
import { findData, saveToStorage } from "./firebase.js";

let accountList = await findData("accountList");
let commentList = await findData("commentList");
let allUserWork = await findData("allUserWork");

let accountID = sessionStorage.getItem("accountID");

const adminName = document.getElementById("admin-name");
const table = document.getElementById("table");
const commentTable = document.getElementById("comments");

// WAIT FOR DATABASE TO UPDATE
let delay = ms => new Promise(res => setTimeout(res, ms));

// OPEN CHOSEN WORK
function viewUserWork(account, workID) {
    // OPEN NEW TAB
    const newTab = window.open('', '_blank');

    newTab.document.open();
    newTab.document.write(`${account.work[workID].html}`);

    // LOAD IMAGES AND AUDIOS
    let images = newTab.document.querySelectorAll("img");
    let audios = newTab.document.querySelectorAll("audio");

    if (images.length > 0) {
        for (let image of images) {
            image.src = account.work[workID].assets[`${image.src.split("/").pop()}`];
        }
    }

    if (audios.length > 0) {
        for (let audio of audios) {
            audio.src = account.work[workID].audios[`${audio.src.split("/").pop()}`];
        }
    }

    newTab.document.close();
}

// VISIBLE ADMIN NAME
if (accountList[accountID].name != undefined) {
    adminName.innerHTML = "Admin: " + accountList[accountID].name;
}
else {
    adminName.innerHTML = "Admin: Anonymous";
}

// VERIFY EXPERIMENT
function verifyExperiment(checkbox, account, i){
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            account.work[i]["isVerified"] = true;
            console.log(allUserWork[account.work[i].indexInAll].isVerified)
            allUserWork[account.work[i].indexInAll].isVerified = true;
        }
        else {
            account.work[i]["isVerified"] = false;
            allUserWork[account.work[i].indexInAll].isVerified = false;
        }

        saveToStorage("accountList", accountList);
        saveToStorage("allUserWork", allUserWork);

        alert("Verified!");
    })
}

//DELETE USER WORK (EXPERIMENT)
function deleteUserWork(deleteBtn, account, i){
    deleteBtn.onclick = function () {
        allUserWork.splice(account.work[i].indexInAll, 1);
        account.work.splice(i, 1);

        saveToStorage("allUserWork", allUserWork);
        saveToStorage("accountList", accountList);

        delay(3000);
        table.replaceChildren();
        table.innerHTML = ` <tr>
                                <th>Index</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Worklist</th>
                                <th>Role</th>
                            </tr>`;
        loadAccounts();
    }
}

// LOAD ACCOUNT WORKS
function loadAccountWorks(account, workList){
    for (let i in account.work) {

        let card = document.createElement("div");
        card.style.display = "flex";
        card.style.justifyContent = "space-evenly";

        let name = document.createElement("u");
        name.style.width = "35%";

        if (account.work[i].name.length < 10) {
            name.innerHTML = account.work[i].name;
        }
        else {
            name.innerHTML = account.work[i].name.substring(0, 7) + "...";
        }

        name.style.cursor = "pointer";
        card.appendChild(name);

        name.addEventListener("click", function () {
            viewUserWork(account, i);
        })

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = account.work[i].isVerified;
        card.appendChild(checkbox);

        verifyExperiment(checkbox, account, i);

        // DELETE USER WORK 
        let deleteBtn = document.createElement("button");
        deleteBtn.style.width = "50%";
        deleteBtn.style.height = "20%";
        deleteBtn.innerHTML = "Delete experiment";
        card.appendChild(deleteBtn);

        deleteUserWork(deleteBtn, account, i);

        workList.appendChild(card);
    }
}

// LOAD ALL ACCOUNTS ON TABLE
function loadAccounts() {
    for (let [i, account] of accountList.entries()) {
        let tr = document.createElement("tr");

        let index = document.createElement("td");
        index.innerHTML = account.index;
        tr.appendChild(index);

        let name = document.createElement("td");

        if (account.name != undefined) {
            name.innerHTML = account.name;
        }
        else {
            name.innerHTML = "This account doesn't set a name yet";
        }

        tr.appendChild(name);

        let email = document.createElement("td");
        email.innerHTML = account.email;
        tr.appendChild(email);

        let pass = document.createElement("td");
        pass.innerHTML = account.pass;
        tr.appendChild(pass);

        let workList = document.createElement("td");

        if (account.work == undefined) {
            let none = document.createElement("td");
            none.innerHTML = "None";

            tr.appendChild(none);
        }
        else {
            loadAccountWorks(account, workList); // load user worklist

            tr.appendChild(workList);
        }

        let div = document.createElement("td");

        let role = document.createElement("input");
        role.type = "number";
        role.min = 0;
        role.max = 1;
        role.value = account.role;

        // CHANGE USER ROLE
        role.addEventListener("change", async function () {
            account.role = role.value;

            accountList[i] = account;
            saveToStorage("accountList", accountList).then(
                accountList = await findData("accountList")
            );

            alert("Please wait, press 'OK'");
            await delay(3000);

            if (accountList[accountID].role == 0) {
                window.location.href = "../index.html"
            }
            else {
                alert("Change role successfully");
            }
        })


        div.appendChild(role);
        tr.appendChild(div);

        table.appendChild(tr);
    }
}
loadAccounts();

// BLOCK USER
function blockUser(comment, btn) {
    btn.onclick = function () {
        if (btn.innerHTML == "Block this user") {
            btn.innerHTML = "Unblock this user";
            accountList[comment.critic_index].isBlocked = true;
        }
        else {
            btn.innerHTML = "Block this user";
            accountList[comment.critic_index].isBlocked = false;
        }

        saveToStorage("accountList", accountList);

        commentTable.replaceChildren();

        commentTable.innerHTML = `  <tr>
                                    <th>Index</th>
                                    <th>Email</th>
                                    <th>Content</th>
                                    <th>Date</th>
                                    <th>Delete</th>
                                    <th>Block user</th>
                                </tr>`;

        loadComments();
    }
}

// DELETE COMMENT
function deleteComment(deleteBtn, i){
    deleteBtn.onclick = function () {
        commentList.splice(i, 1);
        saveToStorage("commentList", commentList);

        location.reload();
    }
}

// COMMENTS LIST
function loadComments() {
    for (let [i, comment] of commentList.entries()) {
        let tr = document.createElement("tr");

        let index = document.createElement("td");
        index.innerHTML = i;
        tr.appendChild(index);

        let email = document.createElement("td");
        email.innerHTML = comment.critic;
        tr.appendChild(email);

        let content = document.createElement("td");
        content.innerHTML = comment.text;
        tr.appendChild(content);

        let date = document.createElement("td");
        date.innerHTML = comment.date;
        tr.appendChild(date);

        let td = document.createElement("td");

        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        td.appendChild(deleteBtn);
        tr.appendChild(td);

        deleteComment(deleteBtn, i);

        let td2 = document.createElement("td");

        let blockUserBtn = document.createElement("button");

        if (!accountList[comment.critic_index].isBlocked) {
            blockUserBtn.innerHTML = "Block this user";
        }
        else {
            blockUserBtn.innerHTML = "Unblock this user";
        }

        blockUser(comment, blockUserBtn);

        td2.appendChild(blockUserBtn);
        tr.appendChild(td2);

        commentTable.appendChild(tr);
    }
}
loadComments();