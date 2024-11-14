const lab = document.getElementById("lab")
const dropper = document.getElementById("dropper")
const phenolphtalein = document.getElementById("phenolphtalein")
const hcl = document.getElementById("hcl")
const liquid = document.getElementById("liquid")
const text = document.getElementById("equation")
const help = document.getElementById("help")
const reload = document.getElementById("reload")
const drop=document.getElementById("drop")
const phenolCap = phenolphtalein.querySelector(".cap")
const phenolBottle = phenolphtalein.querySelector(".bottle")
const hclCap = hcl.querySelector(".cap")
const hclBottle  = hcl.querySelector(".bottle")

let moveLab = false
let moveDropper = false
let tookPhenol = false
let tookHCl = false
let phenolEffected = false
let hclEffected = false
let doneExperiment = false
let movePhenol = false 
let movePhenolBottle = false
let moveHclBottle = false
let moveHCl = false
let movePhenolCap = false
let moveHclCap = false
let white = " rgba(245, 245, 245, 0.515)"
let pink = " rgba(255, 125, 173, 0.656)"
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

phenolCap.addEventListener("click",function(){
    movePhenolCap = moveCtrl(movePhenolCap)
    moveObj(phenolCap,movePhenolCap)
})
phenolBottle.addEventListener("click",function(){
    movePhenolBottle =  moveCtrl(movePhenolBottle)
    moveObj(phenolBottle,movePhenolBottle)
})
hclBottle.addEventListener("click",function(){
    moveHclBottle = moveCtrl(moveHclBottle)
    moveObj(hclBottle, moveHclBottle)
})
hclCap.addEventListener("click",function(){
    moveHclCap = moveCtrl(moveHclCap)
    moveObj(hclCap, moveHclCap)
})
dropper.addEventListener("dblclick", function () {
    // lấy dung dịch phenolphtalein
    if (dropper.getBoundingClientRect().left >= phenolBottle.getBoundingClientRect().left && dropper.getBoundingClientRect().right < phenolBottle.getBoundingClientRect().right + 150) {
        if (dropper.getBoundingClientRect().top > phenolBottle.getBoundingClientRect().top - 100 && dropper.getBoundingClientRect().bottom < phenolBottle.getBoundingClientRect().top + 100) {
            if(phenolCap.getBoundingClientRect().left < phenolBottle.getBoundingClientRect().left || phenolCap.getBoundingClientRect().right > phenolBottle.getBoundingClientRect().right){
                notification("Đã lấy dung dịch Phenolphtalein (C₂₀H₁₄O₄)")
                dropper.querySelector("img").src="././assets/hclDropper.png"
                tookPhenol = true
                tookHCl = false
            }
            else{
                notification("Nắp chưa mở, chưa thế lấy dung dịch!")
            }
        }
    }
    // lấy dung dịch HCl
    else if (dropper.getBoundingClientRect().left >= hclBottle.getBoundingClientRect().left && dropper.getBoundingClientRect().right < hclBottle.getBoundingClientRect().right + 150) {
        if (dropper.getBoundingClientRect().top >= hclBottle.getBoundingClientRect().top - 100 && dropper.getBoundingClientRect().bottom < hclBottle.getBoundingClientRect().top + 100) {
            if(hclCap.getBoundingClientRect().left < hclBottle.getBoundingClientRect().left || hclCap.getBoundingClientRect().right > hclBottle.getBoundingClientRect().right){
                notification("Đã lấy dung dịch HCl")
                dropper.querySelector("img").src="././assets/hclDropper.png"
                tookHCl = true
                tookPhenol = false
            }
            else{
                notification("Nắp chưa mở, chưa thế lấy dung dịch!")
            }
        }
    }
    // nhỏ dung dịch vào ống nghiệm
    else if (dropper.getBoundingClientRect().left >= lab.getBoundingClientRect().left && dropper.getBoundingClientRect().right < lab.getBoundingClientRect().left + 150) {
        if (dropper.getBoundingClientRect().top > lab.getBoundingClientRect().top - 100 && dropper.getBoundingClientRect().bottom < lab.getBoundingClientRect().top + 100) {
       
            dropper.querySelector("img").src="././assets/dropper.png"
            drop.style.opacity="1"
            root.style.setProperty("--dropBottom", (lab.getBoundingClientRect().bottom  - dropper.getBoundingClientRect().bottom + 100) + "px")
            drop.style.animation="dropping 1s ease"
            
            drop.addEventListener("animationend",function(){
                tookHCl = false
                tookPhenol = false
                drop.style.opacity="0"
                drop.style.animation="none"
            })
            
            if (tookHCl && !doneExperiment) {
                notification(`Nhỏ dung dịch HCl vào ống nghiệm`)

                hclEffected = true
                if (phenolEffected) {
                    liquid.style.backgroundColor = white
                    liquid.addEventListener("transitionend", function () {
                        doneExperiment = true
                        equation.innerHTML = "Dung dịch HCl tác dụng với ion OH-, làm giảm nồng độ OH- trong dung dịch nên dung dịch không còn đủ điều kiện duy trì màu sắc, chuyển dần từ đỏ nhạt sang trắng (phản ứng trung hòa)"
                    })
                    visibleConclusion()
                }
                else if (!phenolEffected) {
                        equation.innerHTML = "(dd)NaOH + (dd)HCl → NaCl + H<sub>2</sub>O"
                }
            }
            else if (tookPhenol && !doneExperiment) {
                notification(`Nhỏ dung dịch Phenolphtalein vào ống nghiệm`)

                if (!hclEffected) {
                    liquid.style.backgroundColor = pink
                    liquid.addEventListener("transitionend", function () {
                        equation.innerHTML = "Phenolphtalein làm cho dung dịch NaOH hóa đỏ (hồng)"
                    })
                }
                else if (hclEffected) {
                    equation.innerHTML = "(dd)NaOH + (dd)HCl → NaCl + H<sub>2</sub>O <br> Không đổi màu do phenolphthalein chỉ xuất hiện màu trong môi trường kiềm"
                }

                phenolEffected = true
            }
            else if((tookPhenol || tookHCl) && doneExperiment){
                equation.innerHTML = "Không có phản ứng"
            }
        }
    }
})