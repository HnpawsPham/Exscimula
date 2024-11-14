const showBigLoop = document.getElementById("lon")
const showSmallLoop = document.getElementById("nho")
const showBoth = document.getElementById("both")
const showNote = document.getElementById("shownote")
const hideNote = document.getElementById("hidenote")
const note = document.getElementById("note")
const bigLoopNote = document.getElementById("bigLoopNote")
const smallLoopNote = document.getElementById("smallLoopNote")
const heart = document.getElementById("heart")
const choices = document.querySelectorAll("input")

const part1=document.getElementById("part1")
const part2=document.getElementById("part2")
const part3=document.getElementById("part3")
const part4=document.getElementById("part4")
const sound=document.getElementById("sound")

const map = document.getElementById("map")
const show = document.getElementsByClassName("show")
const blood = document.getElementsByClassName("blood")
const bigLoop = document.getElementById("vong-tuan-hoan-lon")
const smallLoop = document.getElementById("vong-tuan-hoan-nho")

// hiện phần thông tin
let isOn = false
    document.getElementById("conclu").addEventListener("click", function () {
        if (!isOn) {
            document.getElementById("text").style.visibility = "visible"
            isOn = true
        }
        else {
            document.getElementById("text").style.visibility = "hidden"
            isOn = false
        }
})

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
showEach()
for (let option of show) {
    option.addEventListener("change", function () {
        if (showNote.checked) {
            note.style.visibility = "visible"

            showEach()

            bigLoopNote.classList.remove("hidden")
            smallLoopNote.classList.remove("hidden")
        }
        else if (hideNote.checked) {
            note.style.visibility = "hidden"
            bigLoopNote.classList.add("hidden")
            smallLoopNote.classList.add("hidden")
        }

    })
}
document.addEventListener("keypress", async function (e) {
    if (e.key == " ") {
        heart.src = "./assets/heartbeat.png"
        sound.play()

        let horizontalUpLeft = document.createElement("div")
        horizontalUpLeft.classList.add("blood", "oldRedBlood", "HorizontalUpLeft")
        horizontalUpLeft.style.zIndex="3"
        smallLoop.appendChild(horizontalUpLeft)

        let horizontalUpRight = document.createElement("div")
        horizontalUpRight.classList.add("blood", "oldRedBlood", "HorizontalUpRight")
        horizontalUpRight.style.zIndex="6"
        smallLoop.appendChild(horizontalUpRight)

        let HorizontalDownLeft = document.createElement("div")
        HorizontalDownLeft.classList.add("blood", "freshBlood", "HorizontalDownLeft")
        smallLoop.appendChild(HorizontalDownLeft)

        let horizontalDownRight = document.createElement("div")
        horizontalDownRight.classList.add("blood", "freshBlood", "HorizontalDownRight")
        smallLoop.appendChild(horizontalDownRight)

        // end section

        let waveUpRight = document.createElement("div")
        waveUpRight.classList.add("blood", "freshBlood", "waveUpRight")
        waveUpRight.style.zIndex="5"
        bigLoop.appendChild(waveUpRight)

        let waveUpLeft = document.createElement("div")
        waveUpLeft.classList.add("blood", "oldRedBlood", "waveUpLeft")
        bigLoop.appendChild(waveUpLeft)

        let waveDownRight = document.createElement("div")
        waveDownRight.classList.add("blood", "freshBlood", "waveDownRight")
        waveDownRight.style.zIndex="4"
        bigLoop.appendChild(waveDownRight)

        let waveDownLeft = document.createElement("div")
        waveDownLeft.classList.add("blood", "oldRedBlood", "waveDownLeft")
        bigLoop.appendChild(waveDownLeft)

            remove()

        await sleep(200)
        heart.src = "./assets/heart.png"
    }
})

function remove(){
    for(let elm of blood){
        elm.addEventListener("animationend",function(){
            try{
                try{
                    smallLoop.removeChild(elm)
                }
                catch{
                    bigLoop.removeChild(elm)
                }
            }
            catch{}
        })
    }
}
// show 
function showEach(){
    showBigLoop.addEventListener("click", function () {
        if (showBigLoop.checked) {
            map.src = "./assets/vong-tuan-hoa-lon.png"
            map.style.width = "530px"
            map.style.marginTop = "20px"
            smallLoop.style.opacity = "0"
            bigLoop.style.opacity = "1"

            part1.style.opacity="0"
            part2.style.opacity="0"
            part3.style.opacity="1"
            part4.style.opacity="0"

            if(showNote.checked){
                bigLoopNote.classList.remove("hidden")
                smallLoopNote.classList.add("hidden")
            }
        }
    })

    showSmallLoop.addEventListener("click", function () {
        if (showSmallLoop.checked) {
            part1.style.opacity="1"
            part2.style.opacity="1"
            part3.style.opacity="0"
            part4.style.opacity="1"

            map.src = "./assets/vong-tuan-hoan-nho.png"
            map.style.marginTop = "110px"
            map.style.width = "570px"
            bigLoop.style.opacity = "0"
            smallLoop.style.opacity = "1"
            
            if(showNote.checked){
                smallLoopNote.classList.remove("hidden")
                bigLoopNote.classList.add("hidden")
            }
        }
    })

    showBoth.addEventListener("click", function () {
        if (showBoth.checked) {
            map.src = "./assets/noClue.png"
            map.style.marginTop = "20px"
            map.style.width = "570px"
            bigLoop.style.opacity = "1"
            smallLoop.style.opacity = "1"

            part4.style.opacity="0"
            part1.style.opacity="1"
            part2.style.opacity="1"
            part3.style.opacity="1"

            if(showNote.checked){
                smallLoopNote.classList.remove("hidden")
                bigLoopNote.classList.remove("hidden")
            }
        }
    })
}