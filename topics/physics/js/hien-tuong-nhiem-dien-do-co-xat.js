const help = document.getElementById("help")
const tb = document.getElementById("alert")
const string = document.getElementById("straight-string")
const audio = document.getElementById("audio")

let lua = {
    obj: document.getElementById("lua"),
    move: false
}

let len = {
    obj: document.getElementById("len"),
    move: false,
}

let nhua = {
    obj: document.getElementById("nhua"),
    move: false,
    isElectrified: false,
    isHanged: false,
    electrifiedBy: null,
    class: "plastic",
}

let thuytinh = {
    obj: document.getElementById("thuytinh"),
    move: false,
    isElectrified: false,
    isHanged: false,
    electrifiedBy: null,
    class: "glass",
}

let nhua2 = {
    obj: document.getElementById("nhua2"),
    move: false,
    isElectrified: false,
    isHanged: false,
    electrifiedBy: null,
    class: "plastic",
}

let thuytinh2 = {
    obj: document.getElementById("thuytinh2"),
    move: false,
    isElectrified: false,
    isHanged: false,
    electrifiedBy: null,
    class: "glass",
}

let chopsticks = [nhua, nhua2, thuytinh, thuytinh2]


let time = 10
let previousPos = [0, 0]


let sounds = [
    "./assets/rub_sounds/rub1.mp3",
    "./assets/rub_sounds/rub2.mp3",
    "./assets/rub_sounds/rub3.mp3",
    "./assets/rub_sounds/rub4.mp3"
]

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// hướng dẫn thao tác
help.addEventListener("click", function () {
    alert("- Click: bắt đầu di chuyển đồ vật\n- Click lần nữa: bỏ đồ vật xuống\n- Di chuột: di chuyển đồ vật\n- Treo đũa lên dây bằng cách click vào đũa, di chuột đến dây rồi canh sao cho dây nằm ở giữa đũa rồi click vào\n- Di các chiếc đũa còn lại lại gần đũa đã treo để quan sát\n- Click và di chuyển khăn đến chiếc đũa cần cọ xát, sau đó di khăn qua lại/ lên xuống để cọ xát vào đũa\n\n *Chú thích:\n  - Khăn màu cam: khăn lụa\n  - Khăn màu xám xanh: khăn len")
})

// custom alert
function notification(content, milisec) {
    tb.style.display = "flex"
    tb.innerHTML = content
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
// lấy biến css
const root = document.querySelector(":root")

//di chuyển objs
function moveObj(obj, move,objProperty) {
    // bấm lần nữa ngừng di chueyern
    obj.addEventListener("click", function () {
        move = false
    })

    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        if(obj == len.obj){
            for (let dua of chopsticks) {
                if (!dua.isElectrified) {
                    if (len.obj.getBoundingClientRect().left > dua.obj.getBoundingClientRect().left - 50 && len.obj.getBoundingClientRect().right < dua.obj.getBoundingClientRect().right + 50) {
                        if (len.obj.getBoundingClientRect().top > dua.obj.getBoundingClientRect().top - 200 && len.obj.getBoundingClientRect().bottom < dua.obj.getBoundingClientRect().bottom + 200) {
                            dua.isElectrified = rubChopstick(len.obj, dua.isElectrified)
                            dua.electrifiedBy = len
                        }
                    }
                }
            }
        }
        
        if(obj == lua.obj){
            for (let dua of chopsticks) {
                if (!dua.isElectrified) {
                    if (lua.obj.getBoundingClientRect().left > dua.obj.getBoundingClientRect().left - 50 && lua.obj.getBoundingClientRect().right < dua.obj.getBoundingClientRect().right + 50) {
                        if (lua.obj.getBoundingClientRect().top > dua.obj.getBoundingClientRect().top - 200 && lua.obj.getBoundingClientRect().bottom < dua.obj.getBoundingClientRect().bottom + 200) {
                            dua.isElectrified = rubChopstick(lua.obj, dua.isElectrified)
                            dua.electrifiedBy = lua
                        }
                    }
                }
            }
        }
        
        mainEvent(objProperty)

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }

    })
}

nhua.obj.addEventListener("click", function () {
    if (nhua.isHanged) {
        nhua.isHanged = false
        nhua.obj.style.transition = "none"
    }
    putChopsticksIntoString(nhua.obj)
    nhua.move = !nhua.move
    moveObj(nhua.obj, nhua.move,nhua)
})

thuytinh.obj.addEventListener("click", function () {
    if (thuytinh.isHanged) {
        thuytinh.isHanged = false
        thuytinh.obj.style.transition = "none"
    }
    putChopsticksIntoString(thuytinh.obj)
    thuytinh.move = !thuytinh.move
    moveObj(thuytinh.obj, thuytinh.move,thuytinh)
})

nhua2.obj.addEventListener("click", function () {
    if (nhua2.isHanged) {
        nhua2.isHanged = false
        nhua2.obj.style.transition = "none"
    }
    putChopsticksIntoString(nhua2.obj)
    nhua2.move = !nhua2.move
    moveObj(nhua2.obj, nhua2.move,nhua2)
})

thuytinh2.obj.addEventListener("click", function () {
    if (thuytinh2.isHanged) {
        thuytinh2.isHanged = false
        thuytinh2.obj.style.transition = "none"
    }
    putChopsticksIntoString(thuytinh2.obj)
    thuytinh2.move = !thuytinh2.move
    moveObj(thuytinh2.obj, thuytinh2.move,thuytinh2)
})

len.obj.addEventListener("click", function () {
    time = 10
    audio.src = sounds[Math.floor(Math.random() * 4)]
    len.move = !len.move
    moveObj(len.obj, len.move,len)
})

lua.obj.addEventListener("click", function () {
    time = 10
    audio.src = sounds[Math.floor(Math.random() * 4)]
    lua.move = !lua.move
    moveObj(lua.obj, lua.move,lua)
})

function putChopsticksIntoString(chopstick) {
    if (chopstick.getBoundingClientRect().top > string.getBoundingClientRect().top+ 180 && chopstick.getBoundingClientRect().bottom < string.getBoundingClientRect().bottom + 20) {
        if (chopstick.getBoundingClientRect().left > string.getBoundingClientRect().left - 300 && chopstick.getBoundingClientRect().right < string.getBoundingClientRect().right + 300) {
            chopstick.style.position = "absolute"
            chopstick.style.left = string.offsetLeft - chopstick.offsetWidth/2 + "px"

            if (chopstick == nhua.obj) {
                nhua.obj.style.transition = "all 0.5s"
                nhua.isHanged = true
                thuytinh.isHanged = false
                thuytinh2.isHanged = false
                nhua2.isHanged = false
            }
            else if (chopstick == nhua2.obj) {
                nhua2.obj.style.transition = "all 0.5s"
                nhua2.isHanged = true
                thuytinh2.isHanged = false
                thuytinh.isHanged = false
                nhua.isHanged = false
            }
            else if (chopstick == thuytinh.obj) {
                thuytinh.obj.style.transition = "all 0.5s"
                thuytinh.isHanged = true
                nhua.isHanged = false
                nhua2.isHanged = false
                thuytinh2.isHanged = false
            }
            else {
                thuytinh2.obj.style.transition = "all 0.5s"
                thuytinh2.isHanged = true
                nhua.isHanged = false
                thuytinh.isHanged = false
                nhua2.isHanged = false
            }
            notification("Đã treo đũa lên dây",3000)
        }
    }
}

async function rubChopstick(khan, isElectrified) {
    if (time > 0) {
        for (let t = 10; t >= 0; t--) {
            audio.play()
            if (Math.round(khan.getBoundingClientRect().top) != previousPos[0] || Math.round(khan.getBoundingClientRect().left) != previousPos[1]) {
                previousPos = [Math.round(khan.getBoundingClientRect().top), Math.round(khan.getBoundingClientRect().left)]
                time--
                console.log("check " + t + " done!")
                await sleep(500)

                if (t == 0) {
                    time = 10
                    isElectrified = true
                    previousPos = [0, 0]

                    notification("Đũa đã nhiễm điện!", 2000)
                    return isElectrified
                }
            }
        }
    }
}

async function pullEffect(obj, hangedObj) {
    if (obj.getBoundingClientRect().left < hangedObj.getBoundingClientRect().right && obj.getBoundingClientRect().left > hangedObj.getBoundingClientRect().left) {
        if (obj.getBoundingClientRect().top > hangedObj.getBoundingClientRect().top - 100 && obj.getBoundingClientRect().bottom < hangedObj.getBoundingClientRect().bottom + 100) {
            if (obj.getBoundingClientRect().top <= hangedObj.getBoundingClientRect().top) {
                hangedObj.style.transform = `rotate(-${Math.round(hangedObj.getBoundingClientRect().top - obj.getBoundingClientRect().top) - 40}deg)`
            }
            else if (obj.getBoundingClientRect().bottom >= hangedObj.getBoundingClientRect().bottom) {
                hangedObj.style.transform = `rotate(${Math.round(obj.getBoundingClientRect().top - hangedObj.getBoundingClientRect().bottom + 20)}deg)`
            }
        }
    }
    else {
        hangedObj.style.transform = "rotate(0deg)"
    }
}

async function pushEffect(obj, hangedObj) {
    if (obj.getBoundingClientRect().left < hangedObj.getBoundingClientRect().right && obj.getBoundingClientRect().left > hangedObj.getBoundingClientRect().left) {
        if (obj.getBoundingClientRect().top > hangedObj.getBoundingClientRect().top - 100 && obj.getBoundingClientRect().bottom < hangedObj.getBoundingClientRect().bottom + 100) {
            if (obj.getBoundingClientRect().top <= hangedObj.getBoundingClientRect().top) {
                console.log(Math.round(hangedObj.getBoundingClientRect().top - obj.getBoundingClientRect().top) + 20)
                hangedObj.style.transform = `rotate(${Math.abs(Math.round(obj.getBoundingClientRect().top - hangedObj.getBoundingClientRect().bottom)) / 4}deg)`
            }
            else if (obj.getBoundingClientRect().bottom > hangedObj.getBoundingClientRect().bottom) {
                console.log(90 - Math.abs(Math.round(obj.getBoundingClientRect().top - hangedObj.getBoundingClientRect().bottom)))
                hangedObj.style.transform = `rotate(-${90 - Math.abs(Math.round(obj.getBoundingClientRect().top - hangedObj.getBoundingClientRect().bottom)) - 40}deg)`
            }
        }
    }
    else {
        hangedObj.style.transform = "rotate(0deg)"
        string.style.transform = "rotate(0deg)"
        visibleConclusion()
    }
}

async function mainEvent(obj) {
    let node = obj.obj
    // Hai đũa nhựa cọ xát giống
    if ((node == nhua.obj && nhua2.isHanged)) {
        if (nhua.isElectrified && nhua2.isElectrified) {
            if (nhua.electrifiedBy == nhua2.electrifiedBy) {
                pushEffect(node, nhua2.obj)
            }
        }
    }
    else if (node == nhua2.obj && nhua.isHanged) {
        if (nhua.isElectrified && nhua2.isElectrified) {
            if (nhua.electrifiedBy == nhua2.electrifiedBy) {
                pushEffect(node, nhua.obj)
            }
        }
    }
    // Hai đũa nhựa cọ xát khác
    if ((node == nhua.obj && nhua2.isHanged)) {
        if (nhua.isElectrified && nhua2.isElectrified) {
            if (nhua.electrifiedBy != nhua2.electrifiedBy) {
                pullEffect(node, nhua2.obj)
            }
        }
    }
    else if (node == nhua2.obj && nhua.isHanged) {
        if (nhua.isElectrified && nhua2.isElectrified) {
            if (nhua.electrifiedBy != nhua2.electrifiedBy) {
                pullEffect(node, nhua.obj)
            }
        }
    }
    // Hai đữa thủy tinh cọ xát giống
    if ((node == thuytinh.obj && thuytinh2.isHanged)) {
        if (thuytinh.isElectrified && thuytinh2.isElectrified) {
            if (thuytinh.electrifiedBy == thuytinh2.electrifiedBy) {
                pushEffect(node, thuytinh2.obj)
            }
        }
    }
    else if (node == thuytinh2.obj && thuytinh.isHanged) {
        if (thuytinh.isElectrified && thuytinh2.isElectrified) {
            if (thuytinh.electrifiedBy == thuytinh2.electrifiedBy) {
                pushEffect(node, thuytinh.obj)
            }
        }
    }
    // Hai đữa thủy tinh cọ xát khác
    if ((node == thuytinh.obj && thuytinh2.isHanged)) {
        if (thuytinh.isElectrified && thuytinh2.isElectrified) {
            if (thuytinh.electrifiedBy != thuytinh2.electrifiedBy) {
                pullEffect(node, thuytinh2.obj)
            }
        }
    }
    else if (node == thuytinh2.obj && thuytinh.isHanged) {
        if (thuytinh.isElectrified && thuytinh2.isElectrified) {
            if (thuytinh.electrifiedBy != thuytinh2.electrifiedBy) {
                pullEffect(node, thuytinh.obj)
            }
        }
    }
    // Đũa thủy tinh - đũa nhựa cọ xát giống
    if (obj.class =="glass" && nhua.isHanged) {
        if (obj.isElectrified && nhua.isElectrified) {
            if (obj.electrifiedBy == nhua.electrifiedBy) {
                pushEffect(node, nhua.obj)
            }
        }
    }
    else if (obj.class == "glass" && nhua2.isHanged) {
        if (obj.isElectrified && nhua2.isElectrified) {
            if (obj.electrifiedBy == nhua.electrifiedBy) {
                pushEffect(node, nhua2.obj)
            }
        }
    }

    // Đũa thủy tinh - đũa nhựa cọ xát khác
    if (obj.class =="glass" && nhua.isHanged) {
        if (obj.isElectrified && nhua.isElectrified) {
            if (obj.electrifiedBy != nhua.electrifiedBy) {
                pullEffect(node, nhua.obj)
            }
        }
    }
    else if (obj.class == "glass" && nhua2.isHanged) {
        if (obj.isElectrified && nhua2.isElectrified) {
            if (obj.electrifiedBy != nhua.electrifiedBy) {
                pullEffect(node, nhua2.obj)
            }
        }
    }
    // Đũa nhựa - đũa thủy tinh cọ xát giống
    if(obj.class == "plastic" && thuytinh.isHanged){
        if(obj.isElectrified && thuytinh.isElectrified){
            if(obj.electrifiedBy == thuytinh.electrifiedBy){
                pushEffect(node, thuytinh.obj)
            }
        }
    }
    else if(obj.class == "plastic" && thuytinh2.isHanged){
        if(obj.isElectrified && thuytinh2.isElectrified){
            if(obj.electrifiedBy == thuytinh2.electrifiedBy){
                pushEffect(node,thuytinh2.obj)
            }
        }
    }
    // Đũa nhựa - đũa thủy tinh cọ xát khác
    if(obj.class == "plastic" && thuytinh.isHanged){
        if(obj.isElectrified && thuytinh.isElectrified){
            if(obj.electrifiedBy != thuytinh.electrifiedBy){
                pullEffect(node, thuytinh.obj)
            }
        }
    }
    else if(obj.class == "plastic" && thuytinh2.isHanged){
        if(obj.isElectrified && thuytinh2.isElectrified){
            if(obj.electrifiedBy != thuytinh2.electrifiedBy){
                pullEffect(node,thuytinh2.obj)
            }
        }
    }
}