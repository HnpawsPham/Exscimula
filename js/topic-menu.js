import { getData, setData } from "./firebase.js";
import { loadStarRange, searchQuery } from "./auth/storing.js";

const container = document.getElementById("main");
const searchBar = document.querySelector("#search>input");
const searchBtn = document.querySelector("#search>svg");

const subject = searchQuery("subject");
const data = (await getData(`works/`) || [])
    .filter(work => work !== undefined && work.subject === subject);

// CHECK IF THERE IS ANY SIMUALATIONS
function emptyHandle(){
    let p = document.createElement("p");
    p.style.textAlign = "center";
    p.style.color = "var(--cwhite)";
    p.innerHTML = "There is no simulations available.";
    container.appendChild(p);
}

function loadSim(work){
    let preview = work.preview || [];
    let div = document.createElement("div");
    div.classList.add("card");

    let img = document.createElement("img");

    if(preview.length == 0) img.src = "/assets/default.jpg";
    else img.src = preview[0];
    div.appendChild(img);

    let date = document.createElement("i");
    date.innerHTML = "&ensp; " + moment(work.date, "MMDDYYYY").fromNow();
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

    for(let tag of work.tags){
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

    if(work.star.rate_times > 0){
        let i = document.createElement("i");
        i.innerHTML = `&ensp; ${rate}`;
        rating.appendChild(i);
    }

    info.appendChild(rating);
    div.appendChild(info);
    container.appendChild(div);

    container.addEventListener("click", function(){
        window.location.href = `/preview?id=${work.id}&subject=${encodeURIComponent(subject)}`;
    })
}

// ADDITIONAL FUNCTIONS FOR SORTING AND SEARCHING
const sortedByPoint = [...data].sort(searchSimCompare);
const sortedByStar = [...data].sort(sortSimByStarCompare);
const sortedByDate = [...data].sort(sortSimByDateCompare);
const sortedByPopularity = [...data].sort();

function searchSimGetPoint(a){
    let sugg_words = a.split(' ');
    let inp_words = searchBar.value.split(' ');
    let point = 0;

    for(let word of inp_words){
        for(let word1 of sugg_words){
            if (word == word1) point++;
        }
    }
    return point;
}

function searchSimCompare(a, b){
    return searchSimGetPoint(a.name) > searchSimGetPoint(b.name);
}

// Sort increasing: 1 star - 5 stars
function sortSimByStarCompare(a, b){
    let val_a = (a.star.value / a.star.rate_times).toFixed(1) || 0;
    let val_b = (b.star.value / b.star.rate_times).toFixed(1) || 0;
    return val_a < val_b;
}

// Sort increasing: oldest - newest (date)
function sortSimByDateCompare(a, b){
    let d1 = new Date(a.date);
    let d2 = new Date(b.date);
    return d1 < d2;
}

// Binary search: find the nearest index satisfied chosen rate value
function sortSimByStarBNS(x){
    let l = 0, r = sortedByStar.length - 1;
    let res = null;

    while(l <= r){
        let mid = Math.floor(l + (r - l) / 2);
        let val = (sortedByStar[mid].star.value / sortedByStar[mid].star.rate_times).toFixed(1) || 0;

        if(val >= x){ // fix cho nay
            res = mid;
            r = mid - 1;
        }
        else l = mid + 1;
    }

    return res;
}

// console.log(sortedByStar)
console.log(sortedByDate)

const sortByDateBar = document.querySelectorAll("#sort-by-date>span");
for(let opt of sortByDateBar){
    opt.addEventListener("click", function(){
        const chosen = document.querySelector("#sort-by-date>.chosen");
        chosen.classList.remove("chosen");

        opt.classList.add("chosen");
        const type = opt.innerHTML;
        container.replaceChildren();

        // Load sims
        if(type == "Newest") {
            for(let work of sortedByDate) loadSim(work);
        }
        else if(type == "Oldest"){
            sortedByDate.reverse();
            for(let work of sortedByDate) loadSim(work);
        }
        else{
            for(let work of sortedByPopularity) loadSim(work);
        }
    });
}

const sortByStarBar = document.querySelectorAll("#sort-by-star>span");
for(let opt of sortByStarBar){
    opt.addEventListener("click", function(){
        const chosen = document.querySelector("#sort-by-star>.chosen");
        chosen.classList.remove("chosen");

        opt.classList.add("chosen");
        container.replaceChildren();
        let x = parseInt(opt.innerHTML) // rate limit (such as 3.0 > 3.9 star)

        // Load all sims
        if(!x) {
            for(let work of sortedByStar) loadSim(work);
            return;
        }

        // Get values range
        let st = sortSimByStarBNS(x);
        let en = sortSimByStarBNS(x + 1);

        if(!st || !en || st > en){
            emptyHandle();
            return;
        }

        let val = (sortedByStar[en].star.value / sortedByStar[en].star.rate_times).toFixed(1);
        // if(val >= x + 1) en--;
        console.log(x, st, en);

        // Load sims
        for(let i = st; i <= en; i++){
            loadSim(sortedByStar[i]);
        }
    })
}

// SEARCH AND SORT HANDLE
function searchSim(data){
    // LOAD SUGGESTIONS

}

// MAIN HANDLE
let exist = false;
for(let workID in data){
    let work = data[workID];

    if(work.subject == subject){
        exist = true;
        loadSim(work);
    }
}

if(!exist) emptyHandle();

// Search sims
searchBar.addEventListener("keypress", () => {
    searchSim(data);
});

searchBtn.addEventListener("click", () => searchSim(data));