const roses = document.querySelectorAll(".rose")
const knife = document.getElementById("knife")
const colorPicker = document.getElementById("colorPicker")
const help = document.getElementById("help")
const dropper = document.getElementById("dropper")
const water = document.querySelectorAll(".water")
const coc = document.querySelectorAll(".childContainer")
const flow = document.getElementById("flow")
const dye = document.querySelectorAll(".dye")
const tap = document.getElementById("tap")
const restart = document.getElementById("restart")
const tb = document.getElementById("alert")

let moveDropper = false   //cho dropper di chuyển
let moveKnife = false         //cho dao mổ di chuyển
let moveRose = [false, false]      //cho hoa hồng trắng di chuỷen
let moveCoc = [false, false]     //cho cốc di chuyển
let isCut = [false, false]         //check xem đã cắt bông hồng hay chưa
let cocHasWater = [false, false]       //check cốc đã có nước chưa
let isRotated = false         //check xem bình nước đã nghiêng chưa
let take = 0      //check xem đổ nước mấy lần r
let isPouring = [false,false]
let isDyed = [false, false]      //check xem hoa đã được nhuộm chưa
let cocIsDyed = [false, false] // check nước đã nhuộm chưa
let roseInCoc = [false, false]

// hiện controller menu
help.addEventListener("click", function () {
    alert("Click: Di chuyển vật\nNháy đúp chuột: Tương tác với vật\n*Thao tác:\n -Click, di chuột, click gần vòi nước để lấy nước vào cốc\n -Chọn phẩm màu tuỳ thích bằng cách bấm vào ô chọn rồi chọn màu\n -Cắt cuống hoa bằng cách cầm dao và nháy đúp chuột vào thân hoa\n -Nhuộm nước bằng cách cầm ống nhỏ giọt rồi nháy đúp chuột ở phạm vi trong cốc cần nhỏ")
})
$("#alert").hide()

const root = document.querySelector(":root")

// custom alert
function notification(content, milisec) {
    tb.style.display = "flex"
    tb.innerHTML = content
    setTimeout(function () {
        tb.style.display = "none"
    }, milisec)

}

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// làm lại thí nghiệm
restart.addEventListener("click", function () {
    location.reload()
})

function changeColorEffect(liquid, i) {
    console.log(i)

    liquid.style.backgroundColor = colorPicker.value
    liquid.style.animation = "waterColored 2s ease"
    liquid.addEventListener("animationend", async function () {
        liquid.style.animation = "none"
        cocIsDyed[i] = true
        return
    })
}

// đổi phẩm màu cho nước
changeWaterColor()
function changeWaterColor() {
    dropper.addEventListener("dblclick", function () {
        root.style.setProperty("--dropperColor", colorPicker.value)
        for (let liquid of water) {
            if (dropper.getBoundingClientRect().left > liquid.getBoundingClientRect().left && dropper.getBoundingClientRect().right < liquid.getBoundingClientRect().right) {
                if (dropper.getBoundingClientRect().bottom < liquid.getBoundingClientRect().bottom) {
                    if (liquid == water[0]) {
                        if (!cocIsDyed[0]) {
                            changeColorEffect(liquid, 0)
                        }
                        else {
                            notification("Đã nhuộm cốc này", 2000)
                        }
                    }
                    else if (liquid == water[1]) {
                        if (!cocIsDyed[1]) {
                            changeColorEffect(liquid, 1)
                        }
                        else {
                            notification("Đã nhuộm cốc này", 2000)
                        }
                    }
                }
            }
        }
    })
}
// hiệu ứng hoa nhuộm màu
async function mainEvent() {
    for (let i = 0; i < roses.length; i++) {
        for (let j = 0; j < coc.length; j++) {

            if (roses[i].getBoundingClientRect().left >= coc[j].getBoundingClientRect().left - 20 && roses[i].getBoundingClientRect().right <= coc[j].getBoundingClientRect().right + 30) {
                if (roses[i].getBoundingClientRect().bottom <= coc[j].getBoundingClientRect().bottom + 20 && roses[i].getBoundingClientRect().top > coc[j].getBoundingClientRect().top - 300) {
                    roses[i].addEventListener("click", function () {
                        if (!roseInCoc[i]) {
                            roses[i].style.zIndex = "-2"
                            roseInCoc[i] = true
                        }
                        else {
                            roses[i].style.zIndex = "2"
                            roseInCoc[i] = false
                        }
                    })
                    if (roseInCoc[i]) {
                        if (cocHasWater[j]) {
                            if (isCut[j]) {
                                if (cocIsDyed[j]) {
                                    if (!isDyed[i]) {
                                        dye[i].style.opacity = "0.2"
                                        dye[i].style.backgroundColor = coc[j].querySelector(".water").style.backgroundColor
                                        dye[i].style.animation = "dyeing 7s ease"
                                        dye[i].addEventListener("animationend", function () {
                                            dye[i].style.backgroundColor = coc[j].querySelector(".water").style.backgroundColor
                                            dye[i].style.height = "90px"
                                            dye[i].style.top = "5px"
                                            isDyed[i] = true
                                            visibleConclusion()
                                        })
                                    }
                                }
                                else {
                                    dye[i].style.opacity = "0"
                                }
                            }
                            else {
                                notification("Cắt cuống xéo để cây hút nước tốt hơn!", 2000)
                            }
                        }
                        else {
                            notification("Cắt cuống thân cây trước!", 2000)
                        }
                    }
                }
            }
        }
    }
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
function moveObj(obj, move) {
    // bấm lần nữa ngừng di chueyern
    obj.addEventListener("click", function () {
        move = false
    })

    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY
        mainEvent()

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0px"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }
    })
}


// di chuyển dropper
dropper.addEventListener("click", function () {
    moveDropper = moveCtrl(moveDropper)
    moveObj(dropper, moveDropper)
})

// lấy nước
async function getWater(obj, i) {
    if (obj.className == "childContainer" && !cocHasWater[i]) {
        if (obj.getBoundingClientRect().left > (tap.getBoundingClientRect().left - 200)) {
            if (obj.getBoundingClientRect().bottom <= (tap.getBoundingClientRect().bottom + 400)) {
                obj.style.top = "200px"
                obj.style.right = "300px"

                flow.style.animation = "pouring 2.5s ease"
                isPouring[i]=true
                flow.addEventListener("animationend", function () {
                    flow.style.height = "400px"
                })

                await sleep(2000)
                water[i].style.animation = "waterRising 4s ease"
                water[i].addEventListener("animationend", function () {
                    water[i].style.height = "180px"
                })

                await sleep(2000)
                isPouring[i]=false
                flow.style.animation = "stop 2.5s ease"
                flow.addEventListener("animationend", function () {
                    flow.style.height = "0px"
                    cocHasWater[i] = true
                    return
                })
            }
        }
    }
}

// cắt cọng hoa
function cutRose(i) {
    knife.addEventListener("dblclick", function () {
        if (knife.getBoundingClientRect().left > roses[i].getBoundingClientRect().left && knife.getBoundingClientRect().right < roses[i].getBoundingClientRect().right + knife.getBoundingClientRect().width) {
            if (knife.getBoundingClientRect().top > roses[i].getBoundingClientRect().top + 100 && knife.getBoundingClientRect().bottom < roses[i].getBoundingClientRect().bottom) {
                if (!isCut[i]) {
                    roses[i].querySelector("img").src = "./assets/cut.png"
                    isCut[i] = true;
                }
            }
        }
    })
}
// cho dao di chuyển
knife.addEventListener("click", function () {
    moveKnife = moveCtrl(moveKnife)
    moveObj(knife, moveKnife)
})

// cho hoa hồng trắng di chuyển
for (let i = 0; i < roses.length; i++) {
    cutRose(i)
    roses[i].style.zIndex = "1"

    roses[i].addEventListener("click", function () {
        moveRose[i] = moveCtrl(moveRose[i])
        moveObj(roses[i], moveRose[i])
    })
}

// di chuyển cốc
for (let i = 0; i < coc.length; i++) {
    coc[i].addEventListener("click", function () {
        coc[i].style.width = "230px"

        getWater(coc[i], i)
        if(!isPouring[i]){
            moveCoc[i] = moveCtrl(moveCoc[i])
            moveObj(coc[i], moveCoc[i])
        }
    })
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
