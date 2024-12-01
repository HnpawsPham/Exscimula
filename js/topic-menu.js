import { getData, setData } from "./firebase.js";
import { loadStarRange, searchQuery } from "./auth/storing.js";

const container = document.getElementById("main");

const data = await getData(`works/`) || [];
const subject = searchQuery("subject");

let workId = data.length;

// TEST
// let work = {
//     id: ++workId,
//     name: "tuyet voi ong mat troi",
//     img: "/assets/codecat.jpg",
//     preview: [],
//     rate: [],
//     question: [],
//     star: {
//         value: 4.5,
//         rate_times: 1000,
//     },
//     author: {
//         name: "HnpawsPham", 
//         uid: "rU32BMEXHabxrY63BzOoRRH34f73", 
//     },
//     tags: ["hoa hoc", "sim"],
//     description: "This is description.",
//     subject: "chemis"
// }

// setData(`works/${workId}` ,work);

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
    else img.src = work.preview[0];
    div.appendChild(img);

    let date = document.createElement("i");
    console.log(work.date)
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

function searchSim(data){
    console.log("cung cung");

    // LOAD SUGGESTIONS

}

function sortSim(data){
    
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
const searchBar = document.querySelector("#search>input");
const searchBtn = document.querySelector("#search>svg");

searchBar.addEventListener("keypress", () => {
    searchSim(data);
});

searchBtn.addEventListener("click", () => searchSim(data));