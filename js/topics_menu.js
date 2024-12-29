import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import moment from 'https://cdn.skypack.dev/moment';
import { delData, getData, setData, updateData_list } from "./firebase.js";
import { defaultImg, loadDate, loadStarRange, searchQuery } from "./auth/storing.js";
import { visibleNoti } from "./notification.js";

const container = document.querySelector(".main");
const searchBar = document.querySelector("#search>input");
const searchBtn = document.querySelector("#search>svg");

const subject = searchQuery("subject");
const tag = searchQuery("tag");

const data = Object.values(await getData(`works/`) || {})
            .filter((work) => work && work.subject == subject && (tag ? work.tags.includes(tag) : true));

// CHECK IF USER IS LOGGED IN (TO LOAD SAVED SIMS)
const auth = getAuth();
let curUser = null;
await new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            curUser = await getData(`users/${user.uid}`);
        }
        resolve();
    });
});


// CHECK IF THERE IS ANY SIMUALATIONS
function emptyHandle() {
    let p = document.createElement("p");
    p.style.textAlign = "center";
    p.style.color = "var(--cwhite)";
    p.innerHTML = "There is no simulations available.";
    container.appendChild(p);
}

async function loadSim(work) {
    let div = document.createElement("div");
    div.classList.add("card");

    let img = document.createElement("img");
    img.src = work.preview?.[0] || defaultImg;
    div.appendChild(img);

    if (curUser) {
        let saveBtn = document.createElement("div");
        saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="18" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#73c0ff" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>`;
        saveBtn = saveBtn.firstElementChild
        div.appendChild(saveBtn);

        // Change color if the sim is already saved
        let ok = curUser.activities?.saved?.hasOwnProperty(work.id) ?? false;
        if (ok) saveBtn.classList.add("clicked");
        else saveBtn.classList.remove("clicked");

        // Add to saved and remove from it
        saveBtn.addEventListener("click", async () => {
            try {
                if (!saveBtn.classList.contains("clicked")) {
                    await setData(`users/${curUser.uid}/activities/saved/${work.id}`, work.id);
                    saveBtn.classList.add("clicked");
                    curUser.activities.saved[work.id] = work.id;

                    visibleNoti("Saved successfully!", 2000);
                }
                else {
                    await delData(`users/${curUser.uid}/activities/saved/${work.id}`);
                    saveBtn.classList.remove("clicked");
                    delete curUser.activities?.saved?.[work.id]; 

                    visibleNoti("Unsaved successfully!", 2000);
                }
            }
            catch (err) {
                console.log(err.message)
                visibleNoti("There was an error occur. Please try again.", 5000);
            }
        });

    }

    let date = document.createElement("i");
    date.innerHTML = "&ensp; " + loadDate(work.date);
    date.classList.add("date");
    div.appendChild(date);

    let info = document.createElement("div");
    info.classList.add("info");

    let h1 = document.createElement("h1");
    h1.innerHTML = work.name;
    info.appendChild(h1);

    let desc = document.createElement("p");
    desc.innerHTML = work.description;
    info.appendChild(desc);

    let author = document.createElement("b");
    author.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#481E14"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>`;
    author.innerHTML += work.author.name;
    info.appendChild(author);

    let tags = document.createElement("div");
    tags.classList.add("tag");

    for (let tag of work.tags) {
        let span = document.createElement("span");
        span.innerHTML = tag;
        tags.appendChild(span);
    }
    info.appendChild(tags);

    // RATING DISPLAY
    let rating = document.createElement("div");
    rating.classList.add("rating");

    let rate = (work.star.value / work.star.rate_times).toFixed(1);
    loadStarRange(rate, rating);

    if (work.star.rate_times > 0) {
        let i = document.createElement("i");
        i.innerHTML = `&ensp; ${rate}`;
        rating.appendChild(i);
    }

    info.appendChild(rating);
    div.appendChild(info);
    container.appendChild(div);

    [info, img].forEach(elm => elm.addEventListener("click", function () {
        let destination = `/preview?id=${work.id}&subject=${work.subject}&name=${work.name}`;
        if(typeof(work.id) == Number) destination += `&folder_name=${work.folder_name}`;

        window.location.href = destination;
    }))
}


// ADDITIONAL FUNCTIONS FOR SORTING AND SEARCHING
// SEARCH
function searchSimGetPoint(a) {
    let sugg_words = a.split(' ');
    let inp_words = searchBar.value.split(' ');
    let point = 0;

    for (let word of inp_words) {
        for (let word1 of sugg_words) {
            if (word1.includes(word)) point++;
        }
    }
    return point;
}

// Compare 2 suggestions by valueing the point
function searchSimCompare(a, b) {
    return searchSimGetPoint(b.name) - searchSimGetPoint(a.name);
}

// SORT
// Sort increasing: 1 star - 5 stars
function sortSimByStarCompare(a, b) {
    let val_a = 0;
    let val_b = 0;

    if(a.star.value && a.star.rate_times) val_a = parseFloat((a.star.value / a.star.rate_times).toFixed(1));
    if(b.star.value && b.star.rate_times) val_b = parseFloat((b.star.value / b.star.rate_times).toFixed(1));
 
    return val_a - val_b;
}

// Sort increasing: oldest - newest (date)
function sortSimByDateCompare(a, b) {
    let d1 = new Date(a.date);
    let d2 = new Date(b.date);
    return d2 - d1;
}

// Sort decreasing: rate + question 
function sortSimByPopularityCompare(a, b) {
    const val_a = (Object.keys(a.rates ?? {}).length ?? 0) + (Object.keys(a.questions ?? {}).length ?? 0);
    const val_b = (Object.keys(b.rates ?? {}).length ?? 0) + (Object.keys(b.questions ?? {}).length ?? 0);

    return val_b - val_a;
}

function getStarVal(index) {
    if(!sortedByStar[index].star.value && !sortedByStar[index].star.rate_times) return 0;
    return parseFloat((sortedByStar[index].star.value / sortedByStar[index].star.rate_times).toFixed(1));
}


// Sorted arrays
// THEM CAC THI NGHIEM LOAD TU SRC CODE NUA!!
const sortedByStar = [...data].sort(sortSimByStarCompare);
const sortedByDate = [...data].sort(sortSimByDateCompare);
const sortedByPopularity = [...data].sort(sortSimByPopularityCompare);

// Binary searching
function sortSimByStarBNS(x) {
    let l = 0, r = sortedByStar.length - 1;
    let res = null;

    while (l <= r) {
        let mid = Math.floor(l + (r - l) / 2);
        let val = getStarVal(mid);

        if(x > val) l = mid + 1;

        else if(val >= x + 1) r = mid - 1;

        if (x <= val && val < x + 1) {
            res = mid;
            r = mid - 1;
        }   
    }
    return res;
}


const sortByDateBar = document.querySelectorAll("#sort-by-date>span");
let reversed = false; // check if the array is already reverse (oldest and newest handle)

for (let opt of sortByDateBar) {
    opt.addEventListener("click", function () {
        const chosen = document.querySelector("#sort-by-date>.chosen");
        chosen.classList.remove("chosen");

        opt.classList.add("chosen");
        const type = opt.innerHTML;
        container.replaceChildren();

        // Load sims
        if (type == "Newest") {
            if (reversed) {
                sortedByDate.reverse();
                reversed = false;
            }
            for (let work of sortedByDate) loadSim(work);
        }
        else if (type == "Oldest") {
            sortedByDate.reverse();
            reversed = true;
            for (let work of sortedByDate) loadSim(work);
        }
        else {
            for (let work of sortedByPopularity) loadSim(work);
        }
    });
}

const sortByStarBar = document.querySelectorAll("#sort-by-star>span");
for (let opt of sortByStarBar) {
    opt.addEventListener("click", function () {
        const chosen = document.querySelector("#sort-by-star>.chosen");
        chosen.classList.remove("chosen");

        opt.classList.add("chosen");
        container.replaceChildren();
        let x = parseInt(opt.innerHTML) // rate limit (such as 3.0 > 3.9 star)

        // Load all sims
        if (!x) {
            for (let work of sortedByStar) loadSim(work);
            return;
        }

        // Get first index of the range and load 'till the end
        let st = sortSimByStarBNS(x);

        if (!st) {
            emptyHandle();
            return;
        }

        // Load sims 
        let arr_limit = sortedByStar.length;
        while(st < arr_limit && getStarVal(st) < x + 1){
            loadSim(sortedByStar[st]);
            st++;
        }
    })
}

// SEARCH HANDLE
function searchSim() {
    container.replaceChildren();
    const sortedByPoint = [...data].sort(searchSimCompare);

    if (sortedByPoint.length == 0 || sortedByPoint[0] == 0) {
        emptyHandle();
        return;
    }
    for (let i = 0; i < 5; i++) {
        let work = sortedByPoint[i];
        if (work) loadSim(work);
    }
}
searchBar.addEventListener("change", searchSim());

// Search sims
searchBar.addEventListener("keypress", () => {
    searchSim(data);
});
searchBtn.addEventListener("click", () => searchSim(data));