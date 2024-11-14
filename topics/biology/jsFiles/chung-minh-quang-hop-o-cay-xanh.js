const coc = document.querySelectorAll(".coc")
const ong = document.querySelectorAll(".ongnghiem")
const rong = document.querySelectorAll(".rong")
const pheu = document.querySelectorAll(".pheu")
const binhnuoc = document.getElementById("binhnuoc")
const help = document.getElementById("help")
const dayCover = document.getElementById("dayCover")
const voice = document.getElementById("voice");

let moveCoc = [false, false]       //cho phép cốc di chuyển
let moveOng = [false, false]       //cho phép ống nghiện di chuyển
let moveRong = [false, false]      //cho phép rong đuôi chó di chuyển
let movePheu = [false, false]      //cho phép phễu di chuyển
let cocHasWater = [false, false]  //check xem cốc có nước k
let ongnghiemHasWater = [false, false]  //check xem ống nghiệm có nước k
let cocIsPouring = [false,false]
let ongIsPouring = [false,false]
let putRong = [false, false]           //check xem bỏ rong vào cốc chưa
let putPheu = [false, false]           //check xem đã bỏ phễu vào chưa
let isRotated = [false, false]         //check xem ống nghiệm đã lật úp chưa
let ongIsOnPheu = [false, false]           //check xem ống nghiệm đã đưuọc đặt lật úp trên phễu chưa

// trợ giúp
help.addEventListener("click", function () {
    alert("Click: Di chuyển vật\nNháy đúp chuột: Tương tác với vật\n*Thao tác:\n -Lấy nước vào ống nghiệm và cốc bằng cách click rồi di chuột, click vào bình lấy nước\n -Đặt cây rong đuôi chó bằng cách click rồi di chuột, click vào cốc\n -Đặt phễu tương tự\n -Lật úp ống nghiệm bằng cách nháy đúp chuột\n*Lưu ý: Cần lật úp ống nghiệm trước khi bỏ vào cốc")
})

// lấy biến của css
let root = document.querySelector(":root")

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// thông báo
$("#alert").hide()

const thong_bao = function (milisec) {
    $("#alert").show()
    setTimeout(function () {
        $("#alert").hide()
    }, milisec)
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
    // lấy nước cho ống nghiệm và cốc
    getWater(obj, index)
    
    putOngIn(obj, index)

    // phản ứng xảy ra
    mainEvent(index)

    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        // phản ứng xảy ra
        mainEvent(index)

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }
    })
}
// cho cốc di chuyển
for (let i = 0; i < coc.length; i++) {
    coc[i].addEventListener("click", function () {
        if(!cocIsPouring[i]){
            moveCoc[i] = moveCtrl(moveCoc[i])
            moveObj(coc[i], moveCoc[i], i)
        }
    })
}
// cho ống nghiện di chuyển
for (let i=0; i<ong.length; i++) {
    ong[i].addEventListener("click", function () {
        if(!ongIsPouring[i]){
            moveOng[i] = moveCtrl(moveOng[i])
            moveObj(ong[i], moveOng[i], i)
        }
    })
}
// cho ống nghiệm lật ngược
for (let i=0; i<ong.length; i++) {
    ong[i].addEventListener("click", function () {
        if(!ongIsPouring[i]){
            upsideDown(ong[i], i);
        }
    })
}

// cho rong đuôi chó di chueyern
for (let i = 0; i < rong.length; i++) {
    rong[i].addEventListener("click", function () {
        moveRong[i] = moveCtrl(moveRong[i])
        moveObj(rong[i], moveRong[i], i)
        putRongIn(rong[i], i)
    })
}
// cho phễu di chuyển
for (let i = 0; i < pheu.length; i++) {
    pheu[i].addEventListener("click", function () {
        movePheu[i] = moveCtrl(movePheu[i])
        moveObj(pheu[i], movePheu[i], i)
        putPheuIn(pheu[i], i)
    })
}
// lật úp ống nghiệm vào bình
function upsideDown(obj, index) {
    obj.addEventListener("dblclick", function () {
        if (obj.className == "ongnghiem") {
            if (!isRotated[index]) {
                obj.style.transform = "rotate(180deg)";
                isRotated[index] = true;

                // nếu có chứa nước thì cho nước chảy ngược xuống (vật lí)
                if (ongnghiemHasWater[index]) {
                    obj.querySelector("div").style.top = 5 + "px"
                    obj.querySelector("div").style.borderRadius = "0px"

                    if(index == 0){
                        dayCover.style.opacity = "1"
                    }
                
                }
            }
            else {
                obj.style.transform = "rotate(0deg)"

                obj.querySelector("div").style.top = 15 + "px"
                obj.querySelector("div").style.borderRadius = " 0 0 20px 20px"

                isRotated[index] = false
            }
        }

    })
}
// lấy nước cho các lọ chứa
function getWater(obj, index) {
    obj.addEventListener("click", async function () {

        if (obj.className != "rong" && obj.className != "pheu") {
            // đổ nước r thì k đổ nữa
            if (obj.className == "ongnghiem" && ongnghiemHasWater[index]) { return false }
            else if (obj.className == "coc" && cocHasWater[index]) { return false }
            else if (obj.className == "ongnghiem" && isRotated[index]) { return false }

            if (obj.getBoundingClientRect().left >= binhnuoc.getBoundingClientRect().left - 50 && obj.getBoundingClientRect().right <= binhnuoc.getBoundingClientRect().right + 50) {
                if (obj.getBoundingClientRect().top > binhnuoc.getBoundingClientRect().top && obj.getBoundingClientRect().bottom < binhnuoc.getBoundingClientRect().bottom + 300) {
                    // chỉnh cho obj ngay vị trí đẹp
                    obj.style.margin = "0"

                    obj.style.top = binhnuoc.getBoundingClientRect().bottom - obj.getBoundingClientRect().height / 2 + "px"
                    obj.style.left = binhnuoc.getBoundingClientRect().left + (binhnuoc.getBoundingClientRect().width - obj.getBoundingClientRect().width) / 2 + "px"
                    root.style.setProperty("--flowHeight", (obj.getBoundingClientRect().height - 50 + "px"))
                    
                    // hiệu ứng rót nước
                    let newHeight = 0
                    if (obj.className == "ongnghiem") {
                        ongnghiemHasWater[index] = true
                        root.style.setProperty("--newHeight", (230 + "px"))
                        newHeight = 230
                        ongIsPouring[index] = true
                    }
                    else if (obj.className == "coc") {
                        cocHasWater[index] = true
                        root.style.setProperty("--newHeight", (100 + "px"))
                        newHeight = 100
                        cocIsPouring[index] = true
                    }
                    await sleep(2000)
                    obj.querySelector("div").style.animation = "fill 3s ease"
                    await sleep(1000)
                    root.style.setProperty("--flowHeight", "0px")
                    obj.querySelector("div").addEventListener("animationend", function () {
                        obj.querySelector("div").style.height = newHeight + "px"
                        if (obj.className == "ongnghiem") {
                            ongIsPouring[index] = false
                        }
                        else if (obj.className == "coc") {
                            cocIsPouring[index] = false
                        }
                    })
                    return true
                }
            }
        }
    })
}
// bỏ rong đuôi chó vào cốc
function putRongIn(obj, index) {
    obj.addEventListener("click", function () {
        if (!putRong[index] && !putPheu[index]) {
            if (obj.getBoundingClientRect().left > coc[index].getBoundingClientRect().left && obj.getBoundingClientRect().right < coc[index].getBoundingClientRect().right) {
                if (obj.getBoundingClientRect().top >= coc[index].getBoundingClientRect().top && obj.getBoundingClientRect().bottom < coc[index].getBoundingClientRect().bottom) {
                    obj.style.top = coc[index].getBoundingClientRect().bottom - obj.getBoundingClientRect().height - 15 + "px"
                    obj.style.left = coc[index].getBoundingClientRect().left + ((coc[index].getBoundingClientRect().width - obj.getBoundingClientRect().width / 2) / 2) + "px"
                    putRong[index] = true
                }
            }
        }
        else {
            putRong[index] = false
        }
    })

}
// đặt phễu úp ngược lên rong đuôi chó
function putPheuIn(obj, index) {
    obj.addEventListener("click", function () {
        if (!putPheu[index]) {
            if (obj.getBoundingClientRect().left > coc[index].getBoundingClientRect().left && obj.getBoundingClientRect().right < coc[index].getBoundingClientRect().right) {
                if (obj.getBoundingClientRect().top >= coc[index].getBoundingClientRect().top && obj.getBoundingClientRect().bottom < coc[index].getBoundingClientRect().bottom) {
                    obj.style.top = coc[index].getBoundingClientRect().bottom - obj.getBoundingClientRect().height - 20 + "px"
                    obj.style.left = coc[index].getBoundingClientRect().left + ((coc[index].getBoundingClientRect().width - obj.getBoundingClientRect().width / 2) / 2) - 15 + "px"
                    putPheu[index] = true
                }
            }
        }
        else {
            putPheu[index] = false
        }
    })
}
// đặt ống nghiệm úp ngược lên phễu + hiệu ứng nước chảy xuống
function putOngIn(obj, index) {
    obj.addEventListener("click", function () {
        if (isRotated[index] && !ongIsOnPheu[index]) {
            if (obj.getBoundingClientRect().left >= coc[index].getBoundingClientRect().left - 20 && obj.getBoundingClientRect().right <= coc[index].getBoundingClientRect().right + 20) {
                if (obj.getBoundingClientRect().top >= coc[index].getBoundingClientRect().top - obj.getBoundingClientRect().height / 2 && obj.getBoundingClientRect().bottom <= coc[index].getBoundingClientRect().bottom + 20) {
                    // nếu có bỏ phễu vào thì margin lên phễu
                    if (putPheu[index]) {
                        obj.style.top = coc[index].getBoundingClientRect().bottom - obj.getBoundingClientRect().height - 65 + "px"
                        obj.style.left = coc[index].getBoundingClientRect().left + ((coc[index].getBoundingClientRect().width - obj.getBoundingClientRect().width / 2) / 2) - 15 + "px"
                        ongIsOnPheu[index] = true

                        if (ongnghiemHasWater[index]) {
                            dayCover.style.opacity = "1"
                        }
                    }
                    // k thì cho nó dưới đáy cốc
                    else {
                        obj.style.top = coc[index].getBoundingClientRect().bottom - obj.getBoundingClientRect().height - 10 + "px"
                        obj.style.left = coc[index].getBoundingClientRect().left + ((coc[index].getBoundingClientRect().width - obj.getBoundingClientRect().width / 2) / 2) - 15 + "px"
                    }
                }
            }
        }
        else {
            ongIsOnPheu[index] = false
        }
    })
}
// phản ứng chính
async function mainEvent(index) {
    if (index == 0) {
        if (rong[index].getBoundingClientRect().left > coc[index].getBoundingClientRect().left && rong[index].getBoundingClientRect().right < coc[index].getBoundingClientRect().right) {
            if (rong[index].getBoundingClientRect().top >= coc[index].getBoundingClientRect().top && rong[index].getBoundingClientRect().bottom < coc[index].getBoundingClientRect().bottom) {
                if (pheu[index].getBoundingClientRect().left > coc[index].getBoundingClientRect().left && pheu[index].getBoundingClientRect().right < coc[index].getBoundingClientRect().right) {
                    if (pheu[index].getBoundingClientRect().top >= coc[index].getBoundingClientRect().top && pheu[index].getBoundingClientRect().bottom < coc[index].getBoundingClientRect().bottom) {
                        if (ong[index].getBoundingClientRect().left >= coc[index].getBoundingClientRect().left - 20 && ong[index].getBoundingClientRect().right <= coc[index].getBoundingClientRect().right + 20) {
                            if (ong[index].getBoundingClientRect().top >= coc[index].getBoundingClientRect().top - ong[index].getBoundingClientRect().height / 2 && ong[index].getBoundingClientRect().bottom <= coc[index].getBoundingClientRect().bottom + 20) {
                                if (putPheu[index] && isRotated[index] && ongIsOnPheu[index] && putRong[index] && cocHasWater[index] && ongnghiemHasWater[index]) {

                                    await sleep(100)

                                    document.querySelectorAll(".water")[index].style.animation = "dry 15s ease"
                                    document.querySelectorAll(".liquid")[index].style.animation = "go_up 15s ease"
                                    document.querySelectorAll(".liquid")[index].addEventListener("animationend", function () {
                                        document.querySelectorAll(".water")[index].style.display = "none"
                                        document.querySelectorAll(".liquid")[index].style.height = "170px"
                                        visibleConclusion()

                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}


// hiện kết luận
function visibleConclusion() {
    document.getElementById("conclu").style.opacity = "1"
    let isOn = false
    document.getElementById("conclu").addEventListener("click", function () {
        if (!isOn) {
            document.getElementById("text").style.visibility = "visible"
            isOn = true;
            voice.play();
        }
        else {
            document.getElementById("text").style.visibility = "hidden"
            isOn = false;
            voice.pause();
        }
    })
}
