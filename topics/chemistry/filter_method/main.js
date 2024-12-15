const lo = document.getElementById("lohh")
const pheu = document.getElementById("pheu")
const loc = document.getElementById("loc")
const coc = document.getElementById("coc")
const honhop = document.getElementById("liquid")
const inside = document.getElementById("inside")
const outside = document.getElementById("outside")
const sulfur = document.getElementById("sulfur")
const container = document.getElementById("container")
const help = document.getElementById("help")
const flow = document.getElementById("flow")
const water = document.getElementById("water")
const liquid = document.getElementById("liquid")
const tb = document.getElementById("alert")

let moveLo = false    //cho lọ di chuyển
let movePheu = false  //cho phễu di chuyển
let moveLoc = false   //cho phép lọc di chuyển
let isHoldingOther = false    //check xem có đang cầm vật khác k
let pheuIsPlaced = false      //check xem đã đặt phễu vào cổ lọ chưa
let giaylocIsPlaced = false       //check xem đã đặt giấy lọc vào phễu chưa
let daTach = false        //xem xem đã tách xong hỗn hợp chưa
let moveCoc     //cho cốc di chuyển
$("#alert").hide();

// hàm thông báo
const thong_bao = function (millisec) {
    tb.style.display = "flex"
    setTimeout(function () {
        tb.style.display = "none"
    }, millisec)
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

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// điều khiển menu
help.addEventListener("click", function () {
    alert("Click chuột trái: Tương tác với đồ vật\nClick chuột trái lần nữa: Bỏ vật lại\n -Thao tác: \n  +Click vào phễu và di chuột lại gần miệng lọ, sau đó click lần nữa\n  + Click vào giấy lọc(màu trắng) và di chuột lại gần phễu rồi click vào\n  + Click vào cốc hõn hợp lưu huỳnh và nước (màu vàng) rồi di chuột lại gần phía bên trên phễu, khi không thể đổ hỗn hợp, hỗn hợp sẽ thu nhỏ lại, khi có thể đổ hõn hợp, hỗn hợp sẽ về kích thước ban đầu lại. Nháy đúp chuột để đổ hỗn hợp vào phễu \n   * Có thể để lọ ở đế (bên phải) hoặc để ngay trên bàn (bên trái)")
})

// hiệu ứng bling
function bling(obj) {
    obj.style.animation = "bling 3s ease"
    obj.addEventListener("animationend", function () {
        obj.style.animation = "none"
    })
}

// bấm thì di chuyển, bấm lại lần nữa thì ngừng di chuyển
function moveControl(move) {
    if (move) {
        return false
    }
    return true
}
// di chuyển đồ vật
function moveObj(obj, move) {

    document.addEventListener("mousemove", async function (event) {
        // ấn lại lần nữa thì ngừng di chuyển
        obj.addEventListener("click", function () {

            move = false
            if (obj == pheu && daTach == false) {
                loc.style.zIndex = "0"      // để khi click thì click vào giấy lọc (do cái nào zindex lớn thì ở trước và k click xuyên đc)
                // xét xem phễu có đặt vào cổ lọ
                if (obj.getBoundingClientRect().bottom > lo.getBoundingClientRect().top) {
                    if ((obj.getBoundingClientRect().left > lo.getBoundingClientRect().left + 40) && (obj.getBoundingClientRect().left < lo.getBoundingClientRect().right - 130)) {
                        pheuIsPlaced = true
                    }
                }
                else {
                    $("#alert").text("Đặt phễu vào cổ lọ")
                    thong_bao(3000)
                    pheuIsPlaced = false
                }
            }
            // nếu ng dùng đặt giấy lọc vào trước thì nhắc
            else if (obj == loc && pheuIsPlaced == false && daTach == false) {
                if (loc.getBoundingClientRect().bottom > lo.getBoundingClientRect().top) {
                    if ((obj.getBoundingClientRect().left > lo.getBoundingClientRect().left + 40) && (obj.getBoundingClientRect().left < lo.getBoundingClientRect().right - 130)) {
                        $("#alert").text("Đặt phễu vào trước!")
                        thong_bao(3000)
                    }
                }
            }
            // kiểm tra xem ng dùng có đặt giấy lọc đúng chỗ k
            if (obj == loc) {
                if (loc.getBoundingClientRect().top >= pheu.getBoundingClientRect().top - 5 && loc.getBoundingClientRect().top <= pheu.getBoundingClientRect().top + 10) {
                    // nếu phễu đã đặt thì cho phép đặt giấy lọc vào
                    if (pheuIsPlaced) {
                        loc.style.zIndex = "-2"
                        giaylocIsPlaced = true
                        pheu.addEventListener("click", function () {
                            loc.style.zIndex = "0"
                            giaylocIsPlaced = false
                        })
                    }
                }
                // nếu để chưa ngay thì nhắc
                else if (pheuIsPlaced && daTach == false && !(loc.getBoundingClientRect().top >= pheu.getBoundingClientRect().top - 5 && loc.getBoundingClientRect().top <= pheu.getBoundingClientRect().top + 10)) {
                    $("#alert").text("Đặt giấy lọc vào trong phễu")
                    thong_bao(3000)
                }
                else if (pheuIsPlaced && daTach && !(loc.getBoundingClientRect().top >= pheu.getBoundingClientRect().top - 5 && loc.getBoundingClientRect().top <= pheu.getBoundingClientRect().top + 10)) {
                    $("#alert").text("Lưu huỳnh (sulfur) bị giữ lại trong giấy lọc")
                    thong_bao(3000)
                    bling(sulfur)
                }
            }
            else if (obj == lo && daTach) {
                $("#alert").text("Ta thu được nước đã tách ra khỏi hỗn hợp")
                thong_bao(3000)
            }
        })

        // đổ sulfur  + nước vào phễu
        if (obj == coc && pheuIsPlaced && daTach == false) {
            if (coc.getBoundingClientRect().top < pheu.getBoundingClientRect().top) {
                if (coc.getBoundingClientRect().left > pheu.getBoundingClientRect().right && coc.getBoundingClientRect().right < pheu.getBoundingClientRect().right + 120) {
                    // kt xem có giấy lọc chưa
                    if (giaylocIsPlaced) {
                        // chỉnh cho ngay thôi
                        container.style.width = "150px"
                        liquid.style.width = "120px"
                        liquid.style.height = "130px"
                        liquid.style.left = "20px"

                        obj.addEventListener("dblclick", async function () {
    
                            move = false

                            obj.style.transform = "rotate(-80deg)"
                            inside.style.opacity = "1"
                            outside.style.opacity = "1"

                            inside.style.animation = "shrink 5s ease"
                            outside.style.animation = "drop 5s ease"
                            honhop.style.animation = "pour 5s ease"
                            sulfur.style.opacity = "1"

                            honhop.addEventListener("animationend", function () {
                                obj.style.transform = "rotate(0deg)"
                                inside.style.opacity = "0"
                                outside.style.opacity = "0"
                                honhop.style.opacity = "0"
                                inside.style.animation = "none"
                                outside.style.animation = "none"
                                honhop.style.animation = "none"
                            })

                            // hiệu ứng nước tách ra khỏi sulfur
                            await sleep(1000)
                            flow.style.animation = "run 3s ease"
                            flow.style.height = "220px"
                            await sleep(2000)
                            water.style.animation = "fill 5s ease"
                            water.style.height = "80px"
                            water.style.borderRadius = "60px 60px 10px 10px"
                            flow.addEventListener("animationend",function(){
                                flow.style.animation = "stop 3s ease"
                                flow.addEventListener("animationend",function(){
                                    flow.style.height = "0"
                                    move = true
                                    daTach = true
                                    visibleConclusion()
                                })
                            })
                          
                        })
                    }
                    // chưa thì nhắc
                    else {
                        $("#alert").text("Cần có giấy lọc để lọc!")
                        thong_bao(3000)
                    }
                }
            }
            // để k ngay thì nhắc
            else {

                container.style.width = "100px"
                liquid.style.width = "85px"
                liquid.style.height = "90px"
                liquid.style.left = "10px"

                $("#alert").text("Cẩn thận đừng đổ lung tung!")
                thong_bao(3000)
            }
        }

        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        // cho obj di chuyển theo chuột
        if (move) {
            obj.style.margin = "0"
            obj.style.position = "absolute"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }
    })
}
// di chuyển lọ
lo.addEventListener("click", function () {
    moveLo = moveControl(moveLo)
    moveObj(lo, moveLo)
})
// di chuyển phễu
pheu.addEventListener("click", function () {
    pheu.style.transform = "rotate(0deg)"
    movePheu = moveControl(movePheu)
    moveObj(pheu, movePheu)
})
// di chuyển lọc
loc.addEventListener("click", function () {
    loc.style.transform = "rotate(0deg)"
    moveLoc = moveControl(moveLoc)
    moveObj(loc, moveLoc)
})
//di chuyển cốc
coc.addEventListener("click", function () {
    moveCoc = moveControl(moveCoc)
    moveObj(coc, moveCoc)
})