const help = document.getElementById("help")
const pencil = document.getElementById("pencil")
const water = document.getElementById("water")
const cupOfWater = document.getElementById("cupofwater")
const den = document.getElementById("den")
const material=document.getElementById("material")
const cs = document.getElementById("canvas")
const canvas = cs.getContext("2d")
const lt = document.getElementById("light")
const light = lt.getContext("2d")
const flashlight=document.getElementById("flashlight")
const settingDeg=document.getElementById("settingDeg")
const mirror=document.getElementById("mirror")

let movePencil = false
let canSink = true
let isStopped = false
let moveDen = false
let moveFlashLight=false
let isOn = false      //xem tia laser đã bật lên chưa
let bottom

help.addEventListener("click", function () {
    alert("Click rồi di chuột: di chuyển vật\nNháy chuột: tương tác với vật\n*Thac tác:\n - Click vào ống hút, di chuột đưa ống hút vào cốc\n - Nháy đúp chuột để bật tia laser, di chuột để di chuyển đèn laser, kéo các thanh điều khiển ở bảng điều khiển màu đen để chỉnh cái đại lượng, nhập số vào ô trống số độ cần xoay đèn laser\n - Nháy đúp chuột để bật đèn pin, chiếu đèn pin vào gương")
})

// xử lí hình ảnh
const real = pencil.querySelectorAll(".reference")[0]
const reflect = pencil.querySelectorAll(".reference")[1]

real.style.backgroundPosition = "top"
reflect.style.backgroundPosition = "bottom"
reflect.style.transform = "scaleX(-1)"

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

// hàm đợi
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// điều chỉnh move=true / false
function moveCtrl(move) {
    if (move) {
        return false
    }
    return true
}

//di chuyển objs
function moveObj(obj, move) {
    // bấm lần nữa ngừng di chuyển
    obj.addEventListener("click", function () {
        move = false
    })
    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY
// console.log(mX)
        if (canSink) {
            effect(event)
        }
        else {
            if (!isStopped) {
                isStopped = true
                move = false
            }
            else {
                isStopped = false
                effect(event)
            }
        }

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            if (obj.id == "pencil") {
                obj.style.left = mX - obj.getBoundingClientRect().width / 15 + "px"
                obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            }
            else if (obj.id == "den") {
                obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
                obj.style.top = mY - obj.getBoundingClientRect().height / 1 + "px"
            }
            else {
                obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
                obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            }
        }
    })
}

// di chuyển cốc nước
pencil.addEventListener("click", function (event) {
    pencil.style.transform = "rotate(0deg)"
    movePencil = moveCtrl(movePencil)
    moveObj(pencil, movePencil)
})

// di chuyển đèn laser
den.addEventListener("click", function () {
    moveDen = moveCtrl(moveDen)
    moveObj(den, moveDen)
})

// di chuyển đèn pin
flashlight.addEventListener("click",function(){
    moveFlashLight=moveCtrl(moveFlashLight)
    moveObj(flashlight,moveFlashLight)
})
// hiệu ứng khsuc xạ
function effect(e) {
    if (pencil.getBoundingClientRect().left > cupOfWater.getBoundingClientRect().left + 25 && pencil.getBoundingClientRect().right < cupOfWater.getBoundingClientRect().right - 15) {
        if (pencil.getBoundingClientRect().bottom > water.getBoundingClientRect().top + 5) {
            // xem hướng chuột lên hay xuống

            if (pencil.getBoundingClientRect().bottom <= cupOfWater.getBoundingClientRect().bottom - 20) {
                canSink = true
            }
            else {
                canSink = false
                return
            }


            let reflectHeight = (water.getBoundingClientRect().top - pencil.getBoundingClientRect().bottom + 1) * -1;
            reflect.style.opacity = "1"

            if (e.clientY - window.innerHeight / 2 > 0) {
                real.style.height = pencil.getBoundingClientRect().height - reflectHeight + "px"
                reflect.style.height = reflectHeight - 6 + "px"       //bottom
            }
            else {
                real.style.height = pencil.getBoundingClientRect().height - reflectHeight + "px"
                reflect.style.height = reflectHeight + "px"   //top
            }
            reflect.style.width = "25px"
            reflect.style.margin = `${real.getBoundingClientRect().height}px 0 0 -7px`
        }
    }
    else {
        reflect.style.opacity = "0"
        reflect.style.margin = "0"
        reflect.style.height = "390.04px"
        reflect.style.width = "19.99px"
        real.style.height = "390.04px"
        real.style.width = "19.99px"
    }
}
// bắt đầu chiếu tia laser
den.addEventListener("dblclick", function () {
    if (cs.style.opacity == "0") {
        cs.style.opacity = "1"
        den.addEventListener("mousemove", function () {
            canvas.clearRect(0, 0, cs.width, cs.height);
            canvas.beginPath();
            canvas.moveTo(20, 0);

            let endPoint = material.getBoundingClientRect().top - den.getBoundingClientRect().bottom + 10
            let bottomArris = Math.tan(79 * Math.PI / 180) * endPoint

            canvas.lineTo(bottomArris, endPoint); //x và y
            drawLaserLine(bottomArris,endPoint)

            canvas.lineWidth = 3;
            canvas.strokeStyle = "rgba(46, 255, 46, 0.731)";
            canvas.stroke();
        })
    }
    else {
        cs.style.opacity = "0"
    }
})
// vẽ đường laser
function drawLaserLine(bottomArris,endPoint) {
    let refractLevel = document.getElementById("refraction").value
    let endY=material.getBoundingClientRect().height+ endPoint
    let endX=bottomArris + refractLevel*10

    canvas.moveTo(bottomArris,endPoint)
    canvas.lineTo(endX,endY)
}

// di chuyển sang trang mới
function nextPage(index) {
    window.scrollTo(index, 0);
    canvas.clearRect(0, 0, cs.width, cs.height);
    cs.style.opacity = "0"
}
// xoay đèn pin
settingDeg.addEventListener("change",function(){
    flashlight.style.transform="rotate("+settingDeg.value+"deg)"
    bottom+=100
})
// bật đèn pin
flashlight.addEventListener("dblclick",function(){
    if(lt.style.opacity=="0"){
        document.addEventListener("mousemove",function(){
            light.clearRect(0,0, lt.width, lt.height)
            lt.style.opacity="1"

            bottom=mirror.getBoundingClientRect().top - flashlight.getBoundingClientRect().bottom

            light.beginPath()
            light.moveTo(0,0)
            light.lineTo(0,bottom)
        
            reflectRay(bottom)

            light.lineWidth = 5;
            light.strokeStyle = "rgb(255, 215, 93)";
            light.stroke();
        })
        
    }
    else{
        lt.style.opacity="0"
    }
})
function reflectRay(bottom){
    light.moveTo(0,bottom)
    if(lt.getBoundingClientRect().left - settingDeg.value >= mirror.getBoundingClientRect().left && flashlight.getBoundingClientRect().right -settingDeg.value <= mirror.getBoundingClientRect().right){
        light.lineTo(200,bottom)
    }
    else{
        light.lineTo(0,document.body.clientHeight)
    }
    
    
}