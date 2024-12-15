const tb = document.getElementById("alert")
const small = document.getElementById("small")
const medium = document.getElementById("medium")
const large = document.querySelector(".large")
const help = document.getElementById("help")
const bowl = document.getElementById("bowl")
const splash = document.getElementById("splash")
const splashSound = document.querySelector("#splashSound")
const mainSound = document.getElementById("mainSound")
const explosion = document.getElementById("explosion")

let randomX = 0;
let randomY = 0
let moveSmall = false;
let moveMedium = false;
let moveLarge = false;
let smallStartEvent = true
let mediumStartEvent = true;
let largeStartEvent = true;

// trợ giúp
help.addEventListener("click", function () {
    alert("Click: Di chuyển vật\nNháy đúp chuột: Tương tác với vật\n*Thao tác:\n - Bỏ Natri vào nước")
})

// lấy biến của css
let root = document.querySelector(":root")

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// thông báo
const thong_bao = function (milisec) {
    tb.style.display = "flex"
    setTimeout(function () {
        tb.style.display = "none"
    }, milisec)
}

// hiện kết luận
function visibleConclusion() {
    document.getElementById("conclu").style.opacity = "1"
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
}

// hiệu ứng bling
function bling(obj) {
    obj.style.animation = "bling 3s ease"
    obj.addEventListener("animationend", function () {
        obj.style.animation = "none"
    })
}

// điều chỉnh move=true / false
function moveCtrl(move) {
    if (move) {
        return false
    }
    return true
}

//di chuyển objs
function moveObj(obj, move, index) {
    // bấm lần nữa ngừng di chueyern
    obj.addEventListener("click", function () {
        move = false
    })

    document.addEventListener("mousemove", function (event) {

        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }
    })
}

small.addEventListener("click", function () {
    moveSmall = moveCtrl(moveSmall)
    moveObj(small, moveSmall)
    isInBowl(small, smallStartEvent)
})
medium.addEventListener("click", function () {
    moveMedium = moveCtrl(moveMedium)
    moveObj(medium, moveMedium)
    isInBowl(medium, mediumStartEvent)
})
large.addEventListener("click", function () {
    moveLarge = moveCtrl(moveLarge)
    moveObj(large, moveLarge)
    isInBowl(large, largeStartEvent)
})
// check xem natri có trong chén k
async function isInBowl(obj, startEvent) {
    let originWidth = obj.getBoundingClientRect().width
    let originHeight = obj.getBoundingClientRect().height
    if (startEvent) {
        if (obj.getBoundingClientRect().left > bowl.getBoundingClientRect().left + 80 && obj.getBoundingClientRect().right < bowl.getBoundingClientRect().right - 80) {
            if (obj.getBoundingClientRect().top > bowl.getBoundingClientRect().top + 80 && obj.getBoundingClientRect().bottom < bowl.getBoundingClientRect().bottom - 80) {
                mainSound.play()
                for (let times = 0; times <= 3; times++) {
                    let randomX = Math.floor(Math.random() * ((bowl.getBoundingClientRect().right - 120) - (bowl.getBoundingClientRect().left + 100))) + bowl.getBoundingClientRect().left + 120;
                    let randomY = Math.floor(Math.random() * ((bowl.getBoundingClientRect().bottom - 120) - (bowl.getBoundingClientRect().top + 100))) + bowl.getBoundingClientRect().top + 120;

                    obj.style.animation = "shadow 1s ease"
                    obj.addEventListener("animationend", function () {
                        obj.style.filter = "drop-shadow(0px 10px 10px rgb(206, 204, 204))"
                    })
                    obj.style.transition = "all 5s"
                    obj.style.top = randomY + "px"
                    obj.style.left = randomX + "px"

                    await sleep(500)

                    originWidth -= obj.getBoundingClientRect().width / 3
                    originHeight -= obj.getBoundingClientRect().height / 2
                    obj.style.width = originWidth + "px"
                    obj.style.height = originHeight + "px"

                      // ngừng âm thanh
                      if (times == 1) {
                        startEvent = false
                    }
                    else if (times == 2) {
                        mainSound.pause()
                    }
                    
                    // nếu là natri cỡ lớn thì xảy ra hiện tượng nổ
                    if (obj.className == "large") {
                        largeExplosion(startEvent)
                    }

                    // cho natri tan
                    await sleep(2000)
                    obj.style.opacity = "0"

                    // nếu là natri cỡ vừa thì xảy ra hiện tượng văng nước 
                    if (obj.id === "medium") {
                        await mediumSplash(obj, startEvent)
                        startEvent = true
                    }
                    visibleConclusion()
                }
            }
        }
    }

}
// nổ nhỏ
async function mediumSplash(obj, startEvent) {
    if (!startEvent) {
        mainSound.pause()
        
        splash.style.opacity = "0.5"
        splash.style.top = obj.getBoundingClientRect().top - 170 + "px"
        splash.style.left = obj.getBoundingClientRect().left - 495 + "px"

        await sleep(200)
        splashSound.play()
        
        await sleep(400)
        splash.style.opacity = "0"
    }

}
// nổ có lửa
async function largeExplosion(startEvent){
    if(!startEvent){
        firstInterval=large.getBoundingClientRect().width
        mainSound.pause()
        explosion.style.opacity="0.5"
        await sleep(500)
        firstInterval-=5
        large.style.width=firstInterval
        let newLarge=document.createElement("div")
        newLarge.classList.add("natri large")
        newLarge.style.backgroundColor="black"
        document.body.appendChild(newLarge)
    }
}