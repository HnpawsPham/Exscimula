const lab = document.getElementById("lab")
const dropper = document.getElementById("dropper")
const phenolphtalein = document.getElementById("phenolphtalein")
const text = document.getElementById("equation")
const help = document.getElementById("help")
const reload = document.getElementById("reload")
const drop=document.getElementById("drop")
const liquid = document.getElementById("liquid")

let moveLab = false
let moveDropper = false

let white = " rgba(245, 245, 245, 0.515)"
liquid.style.backgroundColor = white

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// thông báo

const notification = function (content) {
    text.innerHTML = content
}

// hiệu ứng bling
function bling(obj) {
    obj.style.animation = "bling 3s ease"
    obj.addEventListener("animationend", function () {
        obj.style.animation = "none"
    })
}
// hiện điều khiển
help.addEventListener("click",function(){
    alert("Click: bắt đầu di chuyển đồ vật\nClick lần nữa: bỏ đồ vật xuống\nDi chuột: di chuyển đồ vật\n* Thao tác:\n - Click vào ống nhỏ giọt rồi di chuột đến lọ chất bất kì\n - Nháy đúp chuột để lấy chất\n - Di chuyển ống nhỏ giọt đến ống nghiệm rồi nhỏ vào")
})
// làm lại thí nghiệm
reload.addEventListener("click",function(){
    location.reload()
})
// điều chỉnh move=true / false
function moveCtrl(move) {
    if (move) {
        return false
    }
    return true
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
function moveObj(obj, move) {
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

lab.addEventListener("click", function () {
    moveLab = moveCtrl(moveLab)
    moveObj(lab, moveLab)
})
dropper.addEventListener("click", function () {
    moveDropper = moveCtrl(moveDropper)
    moveObj(dropper, moveDropper)
})