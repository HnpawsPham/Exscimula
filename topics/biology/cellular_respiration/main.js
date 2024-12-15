// trạng thái của cái thùng đựng đậu xanh
const beanBox_interval = [
    "./assets/beanBox/0.png",
    "./assets/beanBox/1.png",
    "./assets/beanBox/2.png"
]

const help = document.getElementById("help")
const xuc = document.getElementById("xuc")
const bong = document.getElementById("bonggon")
const nhietke = document.querySelectorAll(".nhietke")
const gon = document.querySelectorAll(".gon")
const beanBox = document.getElementById("beanbox")
const binh = document.querySelectorAll(".binh")
const noi = document.getElementById("noi")
const nap = document.getElementById("nap")
const bep = document.getElementById("bep")
const conclusion = document.getElementById("conclusion")

let moveXuc = false   //cho phép đồ xúc di chuyển
let moveNap = false       //cho phép nắp nồi di chuyển
let moveNoi = false       //cho phép nồi di chuyển
let moveBong = false  //cho phép bông gòn di chuyển
let moveNhietke = [false, false]   //cho phép nhiệt kế di chuyển
let isShovelled = false   //check xem đồ xúc đã xúc đậu chưa
let i = 0     //chỉ số trạng thái của thùng đậu
let index = -1     //chỉ số thứ tự của bông gòn
let isCook = false    //xem đậu đã được nấu chưa
let potCookedBean = false     //check xem nồi có đậu chín k
let time = 5      //tgian nấu đậu
let beansInPot = false    //check xem trong nồi có đậu k
let binhcodauchin = [false, false]   //check xem bình có đậu chín k
let xucCookedBean = false //check xem đồ xúc có đang xúc đậu chín k
let isIncreased = [false, false]     //check xem nhiệt độ của nhiệt kế đã tăng chưa
let isIncreasing = [false, false]        //check xem nhiệt độ của nhiệt kế có đang tăng k

// check xem bỏ đậu vào bình chưa
let haveBeans = {
    binh0: false,
    binh1: false
}
let cookedBean = {
    binh0: false,
    binh1: false
}
// check xem bông đã dặt vào bình chưa
let placedBong = {
    binh0: false,
    binh1: false
}

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// thông báo
const tb = document.getElementById("alert")
tb.style.display = "none"

const thong_bao = function (milisec) {
    tb.style.display = "flex"
    setTimeout(function () {
        tb.style.display = "none"
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
function moveObj(obj, move) {
    // nếu để đồ xúc trong thùng chứa thì cho xúc
    xuc.addEventListener("dblclick", function (event) {
        // đổ đầu vào bình
        pourBeans()
        // nếu chưa đến giới hạn thì lấy đậu từ box 
        if (i < beanBox_interval.length && i >= 0) {
            shovel()
            beanBox.src = beanBox_interval[i]
        }
        else {
            $("#alert").text("Đừng lãng phí ~_~")
            thong_bao(3000)
            i = 0
        }

    })

    // đổ đậu vào nồi
    putBeanstoPot()
    // nấu đậu
    if (isCovered() && isCook == false) {
        cookBeans()
    }
    pot_to_jar(binh[1], 1)
    pot_to_jar(binh[0], 0)

    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        obj.addEventListener("click", function () {
            move = false
            if (obj.className == "gon") {
                placedBong[1] = putIn(obj, binh[1], placedBong[1])
                placedBong[0] = putIn(obj, binh[0], placedBong[0])
            }
        })

        // BỎ NHIỆT KẾ VÀO BÌNH
        if (obj.className == "nhietke") {
            putNhietKe(obj, binh[0], 0)
            putNhietKe(obj, binh[1], 1)
        }

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"

            if (obj.className == "nhietke") {
                obj.style.top = mY - 20 + "px"
                obj.style.left = mX + "px"
            }
            else {
                obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
                obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
            }
        }
    })
}

// cho xúc di chuyển
xuc.addEventListener("click", function () {
    moveXuc = moveCtrl(moveXuc)
    moveObj(xuc, moveXuc)
})
// di chuyển nắp nồi
nap.addEventListener("click", function () {
    moveNap = moveCtrl(moveNap)
    moveObj(nap, moveNap)
})
//  di chuyển nồi
noi.addEventListener("click", function () {
    nap.style.top += 160 + "px"
    moveNoi = moveCtrl(moveNoi)
    moveObj(noi, moveNoi)
})
// di chuyển nhiệt kế
for (let a = 0; a < nhietke.length; a++) {
    nhietke[a].addEventListener("click", function () {
        nhietke[a].style.transform = "rotate(-2deg)"
        console.log(a)
        if (!isIncreasing[Math.abs(a-1)]) {
            moveNhietke[a] = moveCtrl(moveNhietke[a])
            moveObj(nhietke[a], moveNhietke[a])
        }
    })
}


bong.addEventListener("click", function () {
    // bấm vào thì thêm bông gòn
    try {
        index++
        if (moveBong) {
            gon[index].style.visibility = "hidden"
        }
        else if (!moveBong) {
            gon[index].style.visibility = "visible"
        }
        moveBong = moveCtrl(moveBong)
        moveObj(gon[index], moveBong)
    }
    // nếu lấy quá 10 cục bông gòn thì thông báo
    catch (err) {
        index--
        $("#alert").text("Hết bông gòn!")
        thong_bao(3000)
    }
})
for (let a = 0; a < gon.length; a++) {
    gon[a].addEventListener("click", function () {
        moveBong = moveCtrl(moveBong)
        moveObj(gon[a], moveBong)
    })
}

// giúp đỡ
help.addEventListener("click", function () {
    alert("Click chuột trái: Di chuyển đồ vật\nClick chuột trái lần nữa: Bỏ đồ vật xuống\nNháy đúp chuột: Tương tác với đồ vật\n*Thao tác:\n -Lấy đồ xúc để gần thùng đậu xanh rồi nháy đúp chuột để xúc đậu\n -Đưa đồ xúc gần miệng bình rồi nháy đúp chuột để đổ đậu vào bình\n -Nấu chín đậu bằng cách mở nắp nồi, xúc đậu bỏ vào trong nồi rồi đặt nồi lên bếp, đậy nắp lại\n -Bịt bông gòn để tránh nhiệt thoát ra ngoài\n -Để biết nhiệt độ, đưa đặt nhiệt kế vào trong bình")
})

// hành động xúc
function shovel() {
    if (xuc.getBoundingClientRect().right >= beanBox.getBoundingClientRect().left && xuc.getBoundingClientRect().right < beanBox.getBoundingClientRect().right + 100) {
        if (xuc.getBoundingClientRect().bottom < beanBox.getBoundingClientRect().bottom && xuc.getBoundingClientRect().top > beanBox.getBoundingClientRect().top - 100) {
            // nếu múc đậu r
            if (!isShovelled && !xucCookedBean) {
                xuc.src = "./assets/daxucdau.png"
                if (i < beanBox_interval.length) {
                    i++
                }
                else if (i == beanBox_interval.length) {
                    i = beanBox_interval.length - 1
                }
                isShovelled = true
                return true
            }
            // nếu chưa múc đậu
            if (isShovelled && !xucCookedBean) {
                xuc.src = "./assets/doxuc.png"
                if (i > 0) {
                    i--
                }
                else if (i == 0) {
                    i = 1
                }
                isShovelled = false
                return true
            }
        }
    }
    return true
}

// đổ, lấy đậu vào/ra bình
function pourBeans() {
    // bình 1
    if (xuc.getBoundingClientRect().bottom < binh[0].getBoundingClientRect().bottom && xuc.getBoundingClientRect().bottom > binh[0].getBoundingClientRect().top - 50) {
        if (xuc.getBoundingClientRect().right > binh[0].getBoundingClientRect().left + 40 && xuc.getBoundingClientRect().left < binh[0].getBoundingClientRect().right) {
            // đồ xúc đã có đậu đổ đậu sống vào bình
            if (!placedBong[0] && !haveBeans[0] && isShovelled && !xucCookedBean && !binhcodauchin[0]) {
                xuc.src = "./assets/doxuc.png"
                binh[0].src = "./assets/binh_chua_dau.png"
                haveBeans[0] = true
                isShovelled = false
            }
            // đồ xúc chưa có đậu lấy đậu ra khỏi bình
            else if (haveBeans[0] && !isShovelled && !placedBong[0] && !xucCookedBean && !binhcodauchin[0]) {
                xuc.src = "./assets/daxucdau.png"
                binh[0].src = "./assets/binh.png"
                haveBeans[0] = false
                isShovelled = true
            }
            // đồ xúc chứa đậu chín bỏ vào bình
            else if (!haveBeans[0] && isShovelled && !placedBong[0] && xucCookedBean && !binhcodauchin[0]) {
                xuc.src = "./assets/doxuc.png"
                binh[0].src = "./assets/binhdauchin.png"
                haveBeans[0] = true
                isShovelled = false
                xucCookedBean = false
                cookedBean[0] = true
                binhcodauchin[0] = true
            }
            // lấy đậu chín ra khỏi bình
            else if (haveBeans[0] && !isShovelled && !placedBong[0] && !xucCookedBean && binhcodauchin[0]) {
                xuc.src = "./assets/xucdauchin.png"
                binh[0].src = "./assets/binh.png"
                haveBeans[0] = false
                isShovelled = true
                xucCookedBean = true
                cookedBean[0] = false
                binhcodauchin[0] = false
            }
        }
    }
    // bình 2
    if (xuc.getBoundingClientRect().bottom < binh[1].getBoundingClientRect().bottom && xuc.getBoundingClientRect().bottom > binh[1].getBoundingClientRect().top - 50) {
        if (xuc.getBoundingClientRect().right > binh[1].getBoundingClientRect().left + 40 && xuc.getBoundingClientRect().left < binh[1].getBoundingClientRect().right) {
            // đồ xúc đã có đậu đổ đậu sống vào bình
            if (!haveBeans[1] && isShovelled && !placedBong[1] && !xucCookedBean && !binhcodauchin[1]) {
                xuc.src = "./assets/doxuc.png"
                binh[1].src = "./assets/binh_chua_dau.png"
                haveBeans[1] = true
                isShovelled = false
            }
            // đồ xúc chưa có đậu lấy đậu sống ra khỏi bình
            else if (haveBeans[1] && !isShovelled && !placedBong[1] && !xucCookedBean && !binhcodauchin[1]) {
                xuc.src = "./assets/daxucdau.png"
                binh[1].src = "./assets/binh.png"
                haveBeans[1] = false
                isShovelled = true
            }
            // đồ xúc chứa đậu chín bỏ vào bình
            else if (!haveBeans[1] && isShovelled && !placedBong[1] && xucCookedBean && !binhcodauchin[1]) {
                xuc.src = "./assets/doxuc.png"
                binh[1].src = "./assets/binhdauchin.png"
                haveBeans[1] = true
                isShovelled = false
                xucCookedBean = false
                cookedBean[1] = true
                binhcodauchin[1] = true
            }
            // lấy đậu chín ra khỏi bình
            else if (haveBeans[1] && !isShovelled && !placedBong[1] && !xucCookedBean && binhcodauchin[1]) {
                xuc.src = "./assets/xucdauchin.png"
                binh[1].src = "./assets/binh.png"
                haveBeans[1] = false
                isShovelled = true
                xucCookedBean = true
                cookedBean[1] = false
                binhcodauchin[1] = false
            }
        }
    }
}
// nếu bông gòn để vào cổ bình thì cho z index nó lùi ra sau
function putIn(obj, pot, isPut) {
    if (!isPut && obj.getBoundingClientRect().bottom > pot.getBoundingClientRect().top && obj.getBoundingClientRect().bottom < pot.getBoundingClientRect().top + 100) {
        if (obj.getBoundingClientRect().left > pot.getBoundingClientRect().left + 10 && obj.getBoundingClientRect().left < pot.getBoundingClientRect().right - 10) {
            obj.style.zIndex = "0"
            isPut = true
        }
    }
    else if (!(obj.getBoundingClientRect().bottom > pot.getBoundingClientRect().top && obj.getBoundingClientRect().bottom < pot.getBoundingClientRect().top + 100)) {
        if (!(obj.getBoundingClientRect().left > pot.getBoundingClientRect().left + 10 && obj.getBoundingClientRect().left < pot.getBoundingClientRect().right - 10)) {
            obj.style.zIndex = "2"
            isPut = false
        }
    }
    return isPut
}

// xúc đậu bỏ vào nồi
function putBeanstoPot() {
    xuc.addEventListener("dblclick", function () {
        if (xuc.getBoundingClientRect().left > noi.getBoundingClientRect().left - 20 && xuc.getBoundingClientRect().right < noi.getBoundingClientRect().right + 150) {
            if (xuc.getBoundingClientRect().top < noi.getBoundingClientRect().top && xuc.getBoundingClientRect().bottom < noi.getBoundingClientRect().bottom + 50) {
                // lấy đồ xúc bỏ đậu sống vào nồi
                if (!isCovered() && isShovelled && !beansInPot && !potCookedBean && !xucCookedBean) {
                    noi.src = "./assets/raw.png"
                    isShovelled = false
                    xuc.src = "./assets/doxuc.png"
                    beansInPot = true
                }
                // lấy đậu sống bằng đồ xúc ra khỏi nồi đậu sống
                else if (!isCovered() && beansInPot && !isShovelled && !potCookedBean && !xucCookedBean) {
                    noi.src = "./assets/noi.png"
                    isShovelled = true
                    xuc.src = "./assets/daxucdau.png"
                    beansInPot = false
                }
                // lấy đậu chín bằng đồ xúc ra khỏi nồi đậu chín
                else if (!isCovered() && beansInPot && !isShovelled && potCookedBean && !xucCookedBean) {
                    noi.src = "./assets/noi.png"
                    isShovelled = true
                    xuc.src = "./assets/xucdauchin.png"
                    beansInPot = false
                    potCookedBean = false
                    xucCookedBean = true
                    isCook = false
                    time = 5
                }
                // bỏ đậu chín vào nồi bằng đồ xúc chứa đậu chín
                else if (!isCovered() && !beansInPot && isShovelled && xucCookedBean && !potCookedBean) {
                    noi.src = "./assets/cooked.png"
                    isShovelled = false
                    xuc.src = "./assets/doxuc.png"
                    beansInPot = true
                    potCookedBean = true
                    xucCookedBean = false
                    isCook = true
                    time = 0
                }
            }
        }
    })
}
// kiểm tra xem đậy nắp nồi hay chưa
function isCovered() {
    if (nap.getBoundingClientRect().bottom < noi.getBoundingClientRect().top + 40) {
        if (nap.getBoundingClientRect().left > noi.getBoundingClientRect().left + 10 && nap.getBoundingClientRect().right < noi.getBoundingClientRect().right - 10) {
            return true
        }
        return false
    }
    else {
        return false
    }
}
// nấu đậu
async function cookBeans() {
    if (noi.getBoundingClientRect().bottom < bep.getBoundingClientRect().top + 20 && noi.getBoundingClientRect().bottom > bep.getBoundingClientRect().top - 10) {
        if (noi.getBoundingClientRect().left > bep.getBoundingClientRect().left && noi.getBoundingClientRect().right < bep.getBoundingClientRect().right) {
            if(!isCook && beansInPot && !potCookedBean){
                document.getElementById("boil").play()
                if (time == 5) {
                    for (let t = 5; t >= 0; t--) {
                        document.addEventListener("click", function () {
                            {
                                t = time + 1
                            }
                        })
                        $("#alert").text("Vui lòng chờ " + t + " giây (Thời gian thực: khoảng 10-15 phút)")
                        time--
                        thong_bao(5000)
                        await sleep(1000)
                    }
                    time = 0
                    noi.src = "./assets/cooked.png"
                    $("#alert").text("Đậu đã được nấu chín!")
                    thong_bao(4000)
                    isCook = true
                    potCookedBean = true
                }
            }
        }
    }
}
// lấy nồi đổ đậu chín vào bình
function pot_to_jar(jar, index) {
    noi.addEventListener("dblclick", function (event) {
        if (noi.getBoundingClientRect().top > jar.getBoundingClientRect().top - 200 && noi.getBoundingClientRect().bottom < jar.getBoundingClientRect().bottom) {
            if (noi.getBoundingClientRect().left > jar.getBoundingClientRect().left - 100 && noi.getBoundingClientRect().right < jar.getBoundingClientRect().right + 200) {
                // đổ đậu chín vào bình
                if (potCookedBean && beansInPot && isCook && !binhcodauchin[index] && !haveBeans[index]) {
                    jar.src = "./assets/binhdauchin.png"
                    beansInPot = false
                    noi.src = "./assets/noi.png"
                    potCookedBean = false
                    cookedBean[index] = true
                    binhcodauchin[index] = true
                    haveBeans[index] = true
                    isCook = false
                    time=5
                }
            }

        }
    })
}
// bỏ nhiệt kế vào bình
async function putNhietKe(nhietke, jar, j) {
    if (nhietke.getBoundingClientRect().left > jar.getBoundingClientRect().left + 10 && nhietke.getBoundingClientRect().right < jar.getBoundingClientRect().right - 10) {
        if (nhietke.getBoundingClientRect().bottom <= jar.getBoundingClientRect().bottom && nhietke.getBoundingClientRect().top > jar.getBoundingClientRect().top - 200) {
            if (haveBeans[j]) {
                // hiện nhiệt độ
                nhietke.querySelector(".temperature").classList.remove("hide")
                // tăng độ nếu đậu chính
                if (!cookedBean[j]&& !isIncreased[j] && placedBong[j] && !isIncreasing[j]) {
                    isIncreasing[j] = true

                    nhietke.querySelector(".thanhchay").style.animation = "increaseTemper 15s ease"
                    nhietke.querySelector(".temperature").style.animation = "moveUp 15s ease"

                    // tăng số nhiệt độ
                    for (let temper = 20; temper < 41; temper++) {
                        nhietke.querySelector(".temperature > p").innerText = temper + "°"
                        await sleep(630)
                    }
                    // xogn anim tăng nhiệt độ thì giữ nguên trạng thái
                    nhietke.querySelector(".thanhchay").addEventListener("animationend", function () {
                        nhietke.querySelector(".thanhchay").style.height = "250px"
                        nhietke.querySelector(".temperature").style.bottom = "230px"
                        isIncreased[j] = true
                        isIncreasing[j] = false
                        visibleConclusion()
                    })
                }
            }

        }
    }
    return true
}


// hiện kết luận
function visibleConclusion() {
    document.getElementById("conclu").style.opacity = "1"
    let isOn = false
    document.getElementById("conclu").addEventListener("click", function () {
        if (!isOn) {
            conclusion.play()
            document.getElementById("text").style.visibility = "visible"
            isOn = true
        }
        else {
            document.getElementById("text").style.visibility = "hidden"
            isOn = false
        }
    })
}
