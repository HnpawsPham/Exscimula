const tb = document.getElementById("alert")
const ding = document.getElementById("ding")

const waterBottle = document.getElementById("water-bottle")
const oilBottle = document.getElementById("oil-bottle")
const wineBottle = document.getElementById("wine-bottle")

const water = document.getElementById("water")
const oil = document.getElementById("oil")
const wine = document.getElementById("wine")

const kettle = document.getElementById("kettle")
const tap = document.getElementById("tap")
const flow = document.getElementById("flow")
const help = document.getElementById("help")
const restart = document.getElementById("restart")
const waterInside = document.getElementById("water-inside")
const glassContainer = document.getElementById("glass-container")
const glassContainerWater = document.getElementById("glass-container-water")
const glassContainerSteam = document.getElementById("slight-steam")
const iceBucket = document.getElementById("ice-bucket")
const iceInside = document.getElementById("ice-inside")
//  rượu đông lâu nhất - dầu - nước

let moveOilBottle = false
let moveWaterBottle = false
let moveWineBottle = false
let moveKettle = false
let moveIceBucket = false
let kettleIsOpen = false
let kettleHasWater = false
let kettleIsRotated = false
let isBoiling = false
let isPouring = false
let glassContainerHasWater = false
let waterInGlassContainerIsBoiling = false
let iceBucketHasIce = true
let glassContainerHasIce = false
let visibleIceBucket = false

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// làm lại thí nghiệm
restart.addEventListener("click", function () {
    location.reload()
})

// hướng dẫn thao tác
help.addEventListener("click", function () {
    alert("- Click: bắt đầu di chuyển đồ vật\n- Click lần nữa: bỏ đồ vật xuống\n- Di chuột: di chuyển đồ vật\n- Lấy nước vào ấm bằng cách click vào ấm, di chuyển ấm đến vòi nước ở góc phải bên trên rồi click vào ấm lần nữa/n- Bấm 'p' trên bàn phím để đổ nước\n- Bấm 'b' trên bàn phím để sử dụng ấm đun siêu tốc\n   * Có ba lọ:\n     - Màu vàng: lọ dầu\n     - Màu đỏ: lọ rượu\n     - Màu xanh dương: lọ nước\n Sau khi tất cả chất lỏng trong các lọ dãn ra, xô đá sẽ xuất hiện. Click và di xô đá bên trên bể thủy tinh rồi nháy đúp chuột để đổ đá vào bể.")
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
console.log(root.style)

//di chuyển objs
function moveObj(obj, move) {
    // bấm lần nữa ngừng di chueyern
    obj.addEventListener("click", function () {
        getWater(obj)
        move = false
    })

    document.addEventListener("mousemove", function (event) {
        // lấy pos chuột
        let mX = event.clientX
        let mY = event.clientY

        steamMargin()

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }

    })
}

oilBottle.addEventListener("click", function () {
    if (checkIfInGlassContainer(oilBottle)) {
        liquidBloom(oilBottle)
    }
    moveOilBottle = !moveOilBottle
    moveObj(oilBottle, moveOilBottle)
})

waterBottle.addEventListener("click", function () {
    if (checkIfInGlassContainer(waterBottle)) {
        liquidBloom(waterBottle)
    }
    moveWaterBottle = !moveWaterBottle
    moveObj(waterBottle, moveWaterBottle)
})

wineBottle.addEventListener("click", function () {
    if (checkIfInGlassContainer(wineBottle)) {
        liquidBloom(wineBottle)
    }
    moveWineBottle = !moveWineBottle
    moveObj(wineBottle, moveWineBottle)
})

iceBucket.addEventListener("click", function () {
    moveIceBucket = !moveIceBucket
    moveObj(iceBucket, moveIceBucket)
})

iceBucket.addEventListener("dblclick", function () {
    pourIce()
})

kettle.addEventListener("click", function () {
    pourWater()
    if(!isPouring){
        moveKettle = !moveKettle
        moveObj(kettle, moveKettle)
    }
})

kettle.addEventListener("dblclick", function () {
    steamMargin()
    pourWater()
    if (!kettleIsOpen) {
        kettle.querySelector("img").src = "./assets/open.png"
        kettleIsOpen = true
    }
    else {
        kettle.querySelector("img").src = "./assets/close.png"
        kettleIsOpen = false
    }
})

// LẤY CHIỀU CAO GIỚI HẠN CỦA DUNG DỊCH
function getLiquidRisingHeight(bottle) {
    if (bottle == oilBottle) {
        return 100
    }
    else if (bottle == waterBottle) {
        return 70
    }
    else if (bottle == wineBottle) {
        return 20
    }
}

// BỎ ĐÁ VÀO BỂ
function pourIce() {
    if (iceBucketHasIce) {
        if (iceBucket.getBoundingClientRect().left > glassContainer.getBoundingClientRect().left && iceBucket.getBoundingClientRect().right < glassContainer.getBoundingClientRect().right) {
            if (iceBucket.getBoundingClientRect().bottom < glassContainer.getBoundingClientRect().bottom && iceBucket.getBoundingClientRect().top > glassContainer.getBoundingClientRect().top - iceBucket.getBoundingClientRect().height * 2) {
                iceBucket.src = "./assets/bucket.png"
                iceBucketHasIce = false
                glassContainerSteam.style.opacity = "0"

                if (glassContainerHasWater) {
                    iceInside.style.top = "10px"
                }
                else {
                    iceInside.style.top = "135px"
                }

                iceInside.style.opacity = "1"
                glassContainerHasIce = true
                waterInGlassContainerIsBoiling = false
            }

            checkAll()
        }
    }
    else {
        notification("Xô không còn đá!", 2000)
    }
}

// LẤY NƯỚC VÀO ẤM ĐUN
function getWater(obj) {
    if (obj == kettle) {
        if (kettle.getBoundingClientRect().top > tap.getBoundingClientRect().bottom - 50 && kettle.getBoundingClientRect().bottom < tap.getBoundingClientRect().bottom + kettle.getBoundingClientRect().height + 100) {
            if (kettle.getBoundingClientRect().left < tap.getBoundingClientRect().left && kettle.getBoundingClientRect().left > (tap.getBoundingClientRect().left - kettle.getBoundingClientRect().width)) {
                if (!kettleHasWater) {
                    if (kettleIsOpen) {
                        root.style.setProperty("--flowHeight", kettle.getBoundingClientRect().top + tap.getBoundingClientRect().bottom + "px")
                        waterAnim()
                        kettle.style.transform = "rotate(0deg)"
                    }
                    else {
                        notification("Chưa mở nắp ấm đun!", 2000)
                    }
                }
                else {
                    notification("Trong ấm đã có nước", 2000)
                }
            }
        }
    }

}

async function waterAnim() {
    kettle.style.position = "fixed"
    isPouring = true
    kettle.style.top = "0"
    kettle.style.left = "0"
    kettle.style.margin = "70px 0 0 90vw"
    flow.style.animation = "waterflow 3s ease"
    await sleep(2000)

    flow.addEventListener("animationend", function () {
        flow.style.animation = "watershrink 1s ease "
        flow.addEventListener("animationend", function () {
            root.style.setProperty("--flowHeight", 0 + "px")
            flow.style.animation = "none"
            kettleHasWater = true
            isPouring = false
        })
    })
}

function pourWater() {
    document.body.addEventListener("keypress", function (e) {
        if (e.key.toLowerCase() == "p") {
            if (!glassContainerHasWater) {
                if (kettleHasWater) {
                    if (kettle.getBoundingClientRect().left > glassContainer.getBoundingClientRect().left && kettle.getBoundingClientRect().right < glassContainer.getBoundingClientRect().right) {
                        if (kettle.getBoundingClientRect().bottom < glassContainer.getBoundingClientRect().bottom && kettle.getBoundingClientRect().top < glassContainer.getBoundingClientRect().top - 200) {
                            kettle.style.transform = "rotate(-90deg)"
                            kettleIsRotated = true
                            moveKettle = false
                            isPouring = true
                            steamMargin()

                            root.style.setProperty("--pourWaterHeight", (glassContainer.getBoundingClientRect().bottom - kettle.getBoundingClientRect().bottom - 18 + "px"))

                            if (kettleIsOpen) {
                                waterInside.style.top = "80px"
                            }
                            else {
                                waterInside.style.top = "15px"
                            }

                            waterInside.style.animation = "none"
                            waterInside.style.animation = "pourWater 3s ease"

                            waterInside.addEventListener("animationend", function () {
                                root.style.setProperty("--liquid-height", 150 + "px")

                                glassContainerWater.style.animation = "liquid-rising 2s ease"
                                glassContainerWater.addEventListener("animationend", function () {
                                    glassContainerWater.style.height = "150px"
                                    isPouring = false
                                    glassContainerHasWater = true

                                    if (isBoiling) {
                                        glassContainerSteam.style.opacity = "1"
                                        waterInGlassContainerIsBoiling = true
                                        steam.style.opacity = "0"
                                    }

                                    checkAll()
                                })



                                waterInside.style.animation = "pourWaterShrink 3s ease"

                                waterInside.addEventListener("animationend", function () {
                                    waterInside.style.animation = "none"
                                    waterInside.style.width = "0px"

                                    kettle.style.transform = "rotate(0deg)"
                                    kettleIsRotated = false
                                    steamMargin()
                                    kettleHasWater = false
                                })
                            })
                        }
                    }
                }
                else {
                    notification("Ấm không có nước!", 2000)
                }
            }
            else {
                notification("Bể đã có nước! Không thể đổ được nữa", 4000)
            }
        }
    })
}

function steamMargin() {
    if (!kettleIsOpen) {
        if (!kettleIsRotated) {
            steam.style.transform = "rotate(0deg)"
            steam.style.margin = `${kettle.getBoundingClientRect().top - steam.getBoundingClientRect().height / 1.3}px 0 0 ${kettle.getBoundingClientRect().left - steam.getBoundingClientRect().width / 2.5}px`
        }
        else {
            steam.style.transform = "rotate(120deg)"
            steam.style.margin = `${kettle.getBoundingClientRect().left - steam.getBoundingClientRect().width + 0}px 0 0 ${kettle.getBoundingClientRect().left - 170}px`
        }
    }
    else {
        if (!kettleIsRotated) {
            steam.style.transform = "rotate(-20deg)"
            steam.style.margin = `${kettle.getBoundingClientRect().top - steam.getBoundingClientRect().height / 2}px 0 0 ${kettle.getBoundingClientRect().left - steam.getBoundingClientRect().width / 5}px`
        }
        else {
            steam.style.transform = "rotate(-140deg)"
            steam.style.margin = `${kettle.getBoundingClientRect().top + 50}px 0 0 ${kettle.getBoundingClientRect().left - 90}px`
        }
    }
}

// ĐUN SÔI NƯỚC
function boilWater() {
    document.addEventListener("keypress", async function (e) {
        if (e.key.toLowerCase() == "b") {
            if (kettleHasWater) {
                await sleep(2500)

                isBoiling = true
                steam.style.animation = "start-steaming 3s ease"
                steam.addEventListener("animationend", function () {
                    steam.style.opacity = "0.8"
                })

                await sleep(100000)
                steam.style.animation = "end-steaming 3s ease"

                steam.addEventListener("animationend", function () {
                    isBoiling = false
                    steam.style.opacity = "0"
                    kettleHasWater = false
                })
            }
            else {
                notification("Ấm không có nước để đun!", 3000)
            }
        }
    })
}
boilWater()

// KIỂM TRA XEM LỌ CHẤT CÓ NẰM TRONG BỂ THỦY TINH HAY K
function checkIfInGlassContainer(bottle) {
    if (bottle.getBoundingClientRect().left > glassContainer.getBoundingClientRect().left + 30 && bottle.getBoundingClientRect().right < glassContainer.getBoundingClientRect().right - 30) {
        if (bottle.getBoundingClientRect().bottom < glassContainer.getBoundingClientRect().bottom - 10 && bottle.getBoundingClientRect().top > glassContainer.getBoundingClientRect().top - bottle.getBoundingClientRect().height) {
            return true
        }
        return false
    }
    return false
}

async function appendAnim(liquid, animName, height, reverse) {
    if (!reverse) {
        liquid.style.animation = `${animName} 10s ease`

        liquid.addEventListener("animationend", function () {
            liquid.style.height = height + "px"
            liquid.style.animation = "none"

            // Hiện xô đá khi tất cả đã chạy xong anim
            if(water.style.height == "35px" && wine.style.height == "60px" && oil.style.height == "93px"){
                if(!visibleIceBucket){
                    ding.play()
                    iceBucket.style.display = "inline-block"
                    visibleIceBucket  = true
                }
            }
        })
    }
    else {
        liquid.style.animation = `${animName} 10s cubic-bezier(0.45, 0.25, 0.60, 0.95) reverse`

        liquid.addEventListener("animationend", function () {
            liquid.style.animation = "none"
            liquid.style.height = height + "px"

            visibleConclusion()
        })
    }
}

function liquidBloom(bottle) {
    if (glassContainerHasWater) {
        if (waterInGlassContainerIsBoiling) {
            if (bottle == wineBottle) {
                appendAnim(wine, "wine-rising", 60, false)
            }
            else if (bottle == waterBottle) {
                appendAnim(water, "water-rising", 35, false)
            }
            else if (bottle == oilBottle) {
                appendAnim(oil, "oil-rising", 93, false)
            }
        }
        else if (glassContainerHasIce) {
            if (bottle == wineBottle) {
                root.style.setProperty("--wine-height-start", 25 + "px")
                appendAnim(wine, "wine-rising", 25, true)
            }
            else if (bottle == waterBottle) {
                root.style.setProperty("--water-height-start", 0 + "px")
                appendAnim(water, "water-rising", 0, true)
            }
            else if (bottle == oilBottle) {
                root.style.setProperty("--oil-height-start", 10 + "px")
                appendAnim(oil, "oil-rising", 10, true)
            }
        }
        else if (!waterInGlassContainerIsBoiling && !glassContainerHasIce) {
            notification("Nước ở nhiệt độ bình thường, không có gì thay đổi", 5000)
        }
    }
    else {
        notification("Bể không có nước, không có gì thay đổi", 4500)
    }

}

function checkAll() {
    if (checkIfInGlassContainer(waterBottle)) {
        liquidBloom(waterBottle)

    }
    if (checkIfInGlassContainer(oilBottle)) {
        liquidBloom(oilBottle)
    }
    if (checkIfInGlassContainer(wineBottle)) {
        liquidBloom(wineBottle)
    }
}