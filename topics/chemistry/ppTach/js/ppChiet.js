const dau = document.getElementById("dau")
const nuoc = document.getElementById("nuoc")
const help = document.getElementById("help")
const coc = document.getElementById("coc")
const oilLiquid = document.getElementById("oil")
const waterLiquid = document.getElementById("water")
const pourwater = document.getElementById("pourwater")
const pourdau = document.getElementById("pourdau")
const chiet = document.getElementById("chiet")
const de=document.getElementById("de")
const machine = document.getElementById("machine")
const khoa = document.getElementById("khoa")
const lo = document.getElementById("bottle")
const nut = document.getElementById("nut")
const inside = document.getElementById("inside")
const outside = document.getElementById("outside")
const chietOil = document.getElementById("chietOil")
const chietWater = document.getElementById("chietWater")
const nuocDaTach = document.getElementById("nuocDcTach")

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// hiện kết luận
function visibleConclusion(){
    document.getElementById("conclu").style.opacity="1"
    let isOn=false
    document.getElementById("conclu").addEventListener("click",function(){
        if(!isOn){
            document.getElementById("text").style.visibility="visible"
            isOn=true
        }
        else{
            document.getElementById("text").style.visibility="hidden"
            isOn=false
        }
    })
}

// lấy biến xử lí animation bên css
let root = document.querySelector(":root")
let rootStyles = getComputedStyle(root)


let blue = "rgb(142, 197, 255)"
let yellow = "rgb(255, 255, 129)"
let moveChiet = false //cho phép đồ chiết được nâng lên hạ xuống
let moveNuoc = false //cho phép ống nghiệm chứa nước di chuyển
let moveDau = false  //cho phép ống nghiệm chứa dầu di chuyển
let moveCoc = false  //cho phép cốc di chuyển
let isNotRotated = true //xem mấy ống nghiệm đã được cho phép nghiêng để đổ vào cốc chưa
let first = "" //kiểu string, xem dầu và nước cái nào đổ vào trước
let unlock = false //check xem khoá máy chiết đã mở chưa
let moveKhoa = false //cho phép vặn khoá
let moveLo = false  //cho phép lọ thu kết quả di chuyển
let nothing;   //như cái tên=)
let dblclickTimes = 0   //số lần nháy đúp chuột (để đổi sang anim dầu khi đổ xong nước)
let oilIsPoured = false  //xem đã đổ dầu vào cốc chưa
let waterIsPoured = false   //xem đã đổ nước vào cốc chưa
let mixtureIsPoured = false    //xem đã đổ hỗn hợp vào cốc chưa
let invisibleLine = false  //ẩn cái dòng chảy của hỗn hợp=)
let daChiet = false  //check hỗn hợp đã được tách ra thành nước ở lọ và dầu ở máy chiết chưa
let canChiet = false //khi nhấn nút thì cho phép chiết(k có biến này khi bấm nút dầu với nước từ hư vô đột nhiên xuất hiện=))

$("#alert").hide();

// hàm thông báo
const thong_bao = function (millisec) {
    $("#alert").show()
    setTimeout(function () {
        $('#alert').hide()
    }, millisec)
}

// hiệu ứng bling
function bling(obj) {
    obj.style.animation = "bling 3s ease"
    obj.addEventListener("animationend", function () {
        obj.style.animation = "none"
    })
}
// default color
waterLiquid.style.backgroundColor = blue
oilLiquid.style.backgroundColor = yellow

// menu điều khiển
help.addEventListener("click", function () {
    alert("Click chuột trái: Tương tác với đồ vật\nNháy đúp chuột: đổ chất lỏng\n*Lưu ý:\n- Cần nâng máy chiết để bỏ bình thu chất đã lọc vào và hạ ống dụng cụ chiết vào miệng bình\n- Mở khoá trước khi nâng dụng cụ chiết\n- Đổ hai chất vào cốc to rồi mới đổ vào dụng cụ chiết")
})

// hàm di chuyển objects
function moveObj(obj, move, pourliquid) {

    // kiểm tra xem hỗn hợp trong cốc có được đổ vào miệng máy chiết k
    let startY = Math.round(chiet.getBoundingClientRect().top) - 50
    let startX = 820
    let endX = 850
    let endY = startY - 100

     // click r thì dừng di chuyển
     obj.addEventListener("click", function () {
        move = false

    // nhắc người dùng mở khoá máy chiết khi click vào máy chiết mà khoá chưa mở (để người ta k bị rắc rối với việc k di chuyển được máy chiết)
    try{
        if (obj == chiet && (machine.getBoundingClientRect().top + 200) < mY && mY < (machine.getBoundingClientRect().bottom - 100) && unlock == false) {
            $("#alert").text("Bạn muốn sử dụng máy chiết? Nhớ mở khoá thanh điều chỉnh để nâng hạ theo ý muốn nha")
            thong_bao(3000)
            bling(khoa)
        }
    }
    catch{}
    })

     // hành động đổ chất lỏng
     obj.addEventListener("dblclick", function () {
        move=false
        let mX = event.clientX
        let mY = event.clientY
        // nghiêng các ống nghiệm
        if (obj == coc) {
            isNotRotated = true
        }
        if (obj.className == "canRotate" && isNotRotated) {
            dblclickTimes += 1
            // kiểm tra xem nước hay dầu được đổ vào trước
            if (first == "") {
                first = obj.id
            }
            // chuyển dổi dầu và nước (đừng care nhiều)
            if (first == "dau" && !oilIsPoured && !waterIsPoured) {
                waterLiquid.style.backgroundColor = yellow
                oilLiquid.style.backgroundColor = blue
            }
            // nếu để gần lọ chất vào gần miệng cốc thì add hiệu ứng anim nước dâng lên
            let fromX = Math.round(coc.getBoundingClientRect().left) - 20
            let toX = Math.round(coc.getBoundingClientRect().right) + 80
            let fromY = Math.round(coc.getBoundingClientRect().top) - 100
            let toY = Math.round(coc.getBoundingClientRect().top)
            // hiệu ứng đổ hỗn hợp vào máy chiết
            if (obj == coc && mixtureIsPoured == false && daChiet == false && waterIsPoured && oilIsPoured && obj == coc && startX < mX && mX < endX && startY > mY && mY > endY) {
                obj.style.transform = "rotate(-80deg)"
                mixtureIsPoured = true
                pourMixtureAnim()
                chietOil.style.opacity = "1"
                chietWater.style.opacity = "1"
                inside.addEventListener("animationend", function () {
                    obj.style.transform = "rotate(0deg)"
                    move = true
                    inside.style.opacity = "0"
                    outside.style.opacity = "0"
                    waterLiquid.style.opacity = "0"
                })
            }
            else if (obj == coc && daChiet == false && mixtureIsPoured == false && (oilIsPoured == false || waterIsPoured == false)) {
                $("#alert").text("Đổ cả hai chất lỏng vào cốc trước nha!")
                thong_bao(2000)
            }
            else if (obj == coc && mixtureIsPoured == false && daChiet == false && (startX < mX && mX < endX && startY > mY && mY > endY) && oilIsPoured == false && waterIsPoured == false) {
                $("#alert").text("Cần có chất lỏng để đổ!")
                thong_bao(2000)
            }
            else if (obj == coc && daChiet == false & mixtureIsPoured == false && !(startX < mX && mX < endX && startY > mY && mY > endY)) {
                $("#alert").text("Chỉ được đổ vào máy chiết")
                thong_bao(2000)
                bling(chiet)
            }
            // đổ dầu hoặc lọ nước vào cốc
            else {
                let chat = obj.querySelector(".liquid")
                if (fromX < mX && mX < toX && fromY << mY && mY < toY && (oilIsPoured == false || waterIsPoured == false)) {
                    obj.style.transform = "rotate(-80deg)"
                    // dầu được đổ vào trước
                    if (oilIsPoured == false && waterIsPoured == false && dblclickTimes < 4) {
                        waterIsPoured = true
                        pourliquid.style.opacity = "1"
                        waterLiquid.style.animation = "rise 5s ease"
                        chat.style.animation = "dry 5s ease"
                        waterLiquid.style.height = "90px"
                        pourliquid.style.animation = "shorten 5s ease"
                        pourliquid.addEventListener("animationend", function () {
                            pourliquid.style.opacity = "0"
                            move = true
                            chat.style.width = "0"
                            pourliquid.style.transition = "none"
                            obj.style.transform = "rotate(0deg)"
                        })
                    }
                    // sau khi đổ dầu thì đổ nước
                    else if (waterIsPoured && oilIsPoured == false && dblclickTimes > 4) {
                        oilIsPoured = true
                        pourliquid.style.opacity = "1"
                        oilLiquid.style.animation = "rise 5s ease"
                        chat.style.animation = "dry 5s ease"
                        oilLiquid.style.height = "90px"
                        pourliquid.style.animation = "shorten 5s ease"
                        pourliquid.addEventListener("animationend", function () {
                            pourliquid.style.opacity = "0"
                            move = true
                            chat.style.width = "0"
                            pourliquid.style.transition = "none"
                            obj.style.transform = "rotate(0deg)"
                            isNotRotated = false
                            // hiện tượng dầu nổi lên nước
                            if (first == "dau") {
                                oilLiquid.style.animation = "water-oil 4s ease"
                                waterLiquid.style.animation = "oil-water 4s ease"
                                oilLiquid.style.backgroundColor = yellow
                                waterLiquid.style.backgroundColor = blue
                            }
                        })
                    }
                }
                // k dể vào miệng cốc thì k cho đổ
                else if (!(fromX < mX && mX < toX && fromY << mY && mY < toY) && (oilIsPoured == false || waterIsPoured == false)) {
                    $("#alert").text("Lọ này chỉ có thể được đổ vào cốc")
                    move=true
                    dblclickTimes -= 2
                    thong_bao(2000)
                    bling(coc)
                }
            }
        }
    })
    
    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY
        // cho obj đi theo chuột
        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"

            // đồ chiết k được di chuyển qua lại
            if (obj == dau || obj == nuoc) {
                obj.style.left = mX - obj.getBoundingClientRect().width / 6 + "px"
                obj.style.top = mY - obj.getBoundingClientRect().height / 3 + "px"
            }
            else if (obj == chiet) {
                if ((machine.getBoundingClientRect().top + 170) < mY && mY < (machine.getBoundingClientRect().bottom - 130) && unlock) {
                    khoa.style.transition = "none"
                    obj.style.top = mY - obj.getBoundingClientRect().height * 1.5 + "px"
                    khoa.style.top = mY - obj.getBoundingClientRect().height * 1.35 + "px"
                    nut.style.top = mY - obj.getBoundingClientRect().height / 1.125 + "px"

                    if(!daChiet){
                        let fromTop1 = Math.round(mY - obj.getBoundingClientRect().height - 40)
                        let fromTop2 = Math.round(mY - obj.getBoundingClientRect().height - 110)
                        root.style.setProperty("--fromTop1", (fromTop1 + "px"))
                        root.style.setProperty("--fromTop2", (fromTop2 + "px"))
                        root.style.setProperty("--toTop1", (fromTop1 + 80 + "px"))
                        root.style.setProperty("--toTop2", (fromTop2 + 80 + "px"))
    
                        chietOil.style.top = fromTop2 + "px"
                        chietWater.style.top = fromTop1 + "px"
                    }
                    else{
                        chietOil.style.top = chiet.getBoundingClientRect().bottom-410 + "px"
                    }
                    
                }
            }
            else {
                obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
                obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            }
        }

        // kiểm tra xem lọ đã được đặt dưới máy chiết chưa
        de.addEventListener("mouseover", function () {
                if (chiet.getBoundingClientRect().bottom > lo.getBoundingClientRect().top && lo.getBoundingClientRect().bottom < de.getBoundingClientRect().bottom+10) {
                    canChiet = true
                }
                // còn k thì nhắc
                // else {
                //     $("#alert").text("Nâng máy chiết cao lên để đặt lọ vào")
                //     thong_bao(3000)
                //     bling(khoa)
                // }
        })
        // hover vào đúng giới hạn của máy chiết thì thu nhỏ lại 
        if (oilIsPoured == true && waterIsPoured == true) {
            if (obj == coc && startX < mX && mX < endX && startY > mY && mY > endY) {
                coc.querySelector("#cup").style.width = "100px"
                // chỉnh cho ngay thôi
                oilLiquid.style.backgroundColor=yellow
                waterLiquid.style.backgroundColor=blue
                oilLiquid.style.width = "85px"
                waterLiquid.style.width = "85px"
                oilLiquid.style.left = "13px"
                waterLiquid.style.left = "13px"
                oilLiquid.style.height = "50px"
                waterLiquid.style.height = "50px"
                waterLiquid.style.bottom = "5px"
                oilLiquid.style.bottom = "55px"
            }
        // giãn ra nếu k
            else {
                coc.querySelector("#cup").style.width = "170px"
                oilLiquid.style.width = "145px"
                waterLiquid.style.width = "145px"
                oilLiquid.style.left = "20px"
                waterLiquid.style.left = "20px"
                oilLiquid.style.height = "90px"
                waterLiquid.style.height = "90px"
                waterLiquid.style.bottom = "10px"
                oilLiquid.style.bottom = "100px"
            }
        }
    })
}
// di chuyển lọ dầu
dau.addEventListener("click", function (event) {
    if (moveDau == false) {
        moveDau = true
    }
    else { moveDau = false }
    moveObj(dau, moveDau, pourdau)
})
// di chuyển lọ nước
nuoc.addEventListener("click", function () {
    if (moveNuoc == true) {
        moveNuoc = false
    }
    else { moveNuoc = true }
    moveObj(nuoc, moveNuoc, pourwater)
})
// di chuyển cốc
coc.addEventListener("click", function () {
    if (moveCoc == true) {
        moveCoc = false
    }
    else { moveCoc = true }
    moveObj(coc, moveCoc, nothing)
})
// di chuyển máy chiết
chiet.addEventListener("click", function () {
    if (moveChiet == true) {
        moveChiet = false
    }
    else (moveChiet = true)
    moveObj(chiet, moveChiet, nothing)
})
// vặn khoá
khoa.addEventListener("click", function () {
    if (moveKhoa == true) {
        moveKhoa = false
    }
    else { moveKhoa = true }
    // cho khoá xoay
    if (moveKhoa) {
        khoa.style.transition = "all 0.4s"
        khoa.style.transform = "rotate(180deg)"
        unlock = true
    }
    else {
        khoa.style.transition = "all 0.4s"
        khoa.style.transform = "rotate(0deg)"
        unlock = false
    }
})
// di chuyển lọ
lo.addEventListener("click", function () {
    if (moveLo == true) {
        moveLo = false
    }
    else { moveLo = true }
    // sau khi xong hết thì thông báo kq
    if (daChiet) {
        $("#alert").text("Ta thu được nước đã tách ra khỏi dầu")
        thong_bao(5000)
        visibleConclusion()
    }
    moveObj(lo, moveLo, nothing, nothing)
})

// bấm nút để chiết
nut.addEventListener("click", function () {
    if (!unlock && canChiet && !daChiet) {
        chietOil.style.height = "70px"
        chietOil.style.animation = "lowdown 5s ease"
        chietWater.style.animation = "slidedown 5.5s ease"
        nuocDaTach.style.animation = "nuoc-da-tach-dang-len 5s ease"
        nuocDaTach.addEventListener("animationend", function () {
            nuocDaTach.style.height = "70px"
            chietOil.style.animation = "none"
            chietWater.style.opacity = "0"
            chietOil.style.borderRadius = "0px 0px 100px 100px"
            chietOil.style.top = rootStyles.getPropertyValue("--toTop2")
            daChiet = true
            canChiet = false
        })
    }
    // khoá lại mới bấm nút đc
    else if (unlock && canChiet) {
        $("#alert").text("Khoá thanh điều chỉnh trước khi sử dụng máy chiết!")
        thong_bao(2000)
        bling(khoa)
    }
    // thu được nước sau khi chiết thì k cho bấm nút nữa
    else if (daChiet && !canChiet) {
        chietOil.style.animation = "none"
        chietOil.style.borderRadius = "0px 0px 100px 100px"
        chietWater.style.animation = "none"
        $("#alert").text("Không thể chiết được nữa!")
        thong_bao(2000)
    }
    // k đổ chất vào máy thì thông báo
    else if (mixtureIsPoured == false) {
        $("#alert").text("Máy chiết chưa thể sử dụng, cần có chất lỏng!")
        thong_bao(2000)
    }
})
// k hiện contextmenu (tại nó phiền)
document.body.addEventListener("contextmenu", (e) => { e.preventDefault() });

// hiệu ứng đổ hỗn hợp vào máy chiết
function pourMixtureAnim() {
    if (invisibleLine == false && daChiet == false) {
        mixtureIsPoured = true
        inside.style.opacity = "1"
        outside.style.opacity = "1"
        inside.style.animation = "pouring 4.8s ease"
        outside.style.animation = "dropping 5s ease"
        chietOil.style.animation = "dau-dang-len 2.4s ease"
        // sau khi hiệu ứng đổ dầu xong thì tới hiệu ứng đổ nước + dầu nổi lên trên
        chietOil.addEventListener("animationend", function () {
            chietOil.style.height = "70px"
            chietOil.style.animation = "dau-noi-len 2.6s ease"
            chietOil.style.borderRadius = "20px 20px 0px 0px"
            chietWater.style.animation = "nuoc-dang-len 2.4s ease"
            chietWater.style.height = "80px"
        })
        // chất lỏng trong cốc cạn
        oilLiquid.style.animation = "dry 2.4s ease"
        oilLiquid.addEventListener("animationend", function () {
            oilLiquid.style.opacity = "0"
            waterLiquid.style.animation = "dry 2.4s ease"
        })
        invisibleLine = true
    }
}