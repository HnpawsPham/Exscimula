const kettle = document.getElementById("kettle")
const tap = document.getElementById("tap")
const flow = document.getElementById("flow")
const fridge = document.getElementById("fridge")
const steam = document.getElementById("steam")
const bucket = document.getElementById("bucket")
const liquid = document.getElementById("liquid")
const help = document.getElementById("help")
const tb = document.getElementById("alert")
const elmsInside = document.getElementById("elm-inside")
const steamElms = document.getElementById("steam-elms")
const microscope = document.getElementById("microscope")

let moveKettle = false
let moveMicroscope = false
let moveBucket = false
let kettleOpen = false
let fridgeOpen = false
let kettleHasWater = false
let isBoiling = false
let bucketHasWater = false
let bucketInFridge = false
let microscopeVisiblingSteamElms = false
let sec = 5

let waterType = "none"
let boilTried = false
tb.style.display = "none"

// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// hướng dẫn thao tác
help.addEventListener("click", function () {
    alert("- Click: bắt đầu di chuyển đồ vật\n- Click lần nữa: bỏ đồ vật xuống\n- Di chuột: di chuyển đồ vật\n- Dùng miếng kính (hình chữ nhật có viền đen) để soi phân tử các thể của nước\n- Bấm 'b' trên bàn phím để sử dụng ấm đun siêu tốc\n*Các thể gồm:\n - Thể rắn\n - Thể lỏng\n - Thể khí (hơi nước)")
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
    if (boilTried) {
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
}
// lấy biến css
const root = document.querySelector(":root")

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
        elmsInsideMargin()
        visibleElmsInside()
        boilWater()

        if (move) {
            obj.style.position = "absolute"
            obj.style.margin = "0"
            obj.style.top = mY - obj.getBoundingClientRect().height / 2 + "px"
            obj.style.left = mX - obj.getBoundingClientRect().width / 2 + "px"
        }

    })
}

kettle.addEventListener("click", function () {
    moveKettle = !moveKettle
    moveObj(kettle, moveKettle)
})
kettle.addEventListener("dblclick", function () {
    if (!kettleOpen) {
        kettle.src = "./assets/open.png"
        kettleOpen = true
    }
    else {
        kettle.src = "./assets/close.png"
        kettleOpen = false
    }
})
bucket.addEventListener("click", function () {
    putBucketInFridge()
    moveBucket = !moveBucket
    if (bucketInFridge) {
        bucket.style.pointerEvents = "none"
    }
    else {
        bucket.style.pointerEvents = "auto"
    }

    moveObj(bucket, moveBucket)
})
microscope.addEventListener("click", function () {
    moveMicroscope = !moveMicroscope
    moveObj(microscope, moveMicroscope)
})

function getWater(obj) {
    if (obj == kettle && kettleOpen && !kettleHasWater) {
        if (kettle.getBoundingClientRect().top > tap.getBoundingClientRect().bottom - 20 && kettle.getBoundingClientRect().bottom < tap.getBoundingClientRect().bottom + kettle.getBoundingClientRect().height + 100) {
            if (kettle.getBoundingClientRect().left < tap.getBoundingClientRect().left + 50 && kettle.getBoundingClientRect().left > tap.getBoundingClientRect().left - kettle.getBoundingClientRect().width) {
                root.style.setProperty("--flowHeight", kettle.getBoundingClientRect().top + tap.getBoundingClientRect().bottom + "px")
                waterAnim(kettle)
                kettleHasWater = true
            }
        }
    }
    else if (obj == bucket && !bucketHasWater) {
        if (bucket.getBoundingClientRect().top > tap.getBoundingClientRect().bottom - 20 && bucket.getBoundingClientRect().bottom < tap.getBoundingClientRect().bottom + bucket.getBoundingClientRect().height + 100) {
            if (bucket.getBoundingClientRect().left < tap.getBoundingClientRect().left + 50 && bucket.getBoundingClientRect().left > tap.getBoundingClientRect().left - bucket.getBoundingClientRect().width) {
                root.style.setProperty("--flowHeight", bucket.getBoundingClientRect().bottom - tap.getBoundingClientRect().bottom + "px")
                waterAnim(bucket)
                bucketHasWater = true
                sec = 5
            }
        }
    }
}

fridge.addEventListener("click", function () {
    if (!fridgeOpen) {
        bucket.style.pointerEvents = "auto"
        fridge.src = "./assets/fridgeopen.png"
        fridgeOpen = true
        fridge.style.margin = "140px 0 0 810px"

        if (bucketInFridge) {
            bucket.style.opacity = "1"
        }
    }
    else {
        fridge.src = "./assets/fridge.png"
        fridgeOpen = false
        fridge.style.margin = "100px 0 0 700px"

        if (bucketInFridge) {
            bucket.style.opacity = "0.4"
        }
    }
    freezeWater()
})

function steamMargin() {
    if (!kettleOpen) {
        steam.style.transform = "rotate(0deg)"
        steamElms.style.transform = "rotate(0deg)"
        steam.style.margin = `${kettle.getBoundingClientRect().top - steam.getBoundingClientRect().height / 1.3}px 0 0 ${kettle.getBoundingClientRect().left - steam.getBoundingClientRect().width / 2.5}px`
        steamElms.style.margin = `${kettle.getBoundingClientRect().top - steamElms.getBoundingClientRect().height / 1.2}px 0 0 ${kettle.getBoundingClientRect().left - steamElms.getBoundingClientRect().width / 2.5}px`
    }
    else {
        steam.style.transform = "rotate(-20deg)"
        steamElms.style.transform = "rotate(-20deg)"
        steam.style.margin = `${kettle.getBoundingClientRect().top - steam.getBoundingClientRect().height / 2}px 0 0 ${kettle.getBoundingClientRect().left - steam.getBoundingClientRect().width / 5}px`
        steamElms.style.margin = `${kettle.getBoundingClientRect().top - steamElms.getBoundingClientRect().height / 1.8}px 0 0 ${kettle.getBoundingClientRect().left - steamElms.getBoundingClientRect().width / 8}px`
    }
}

function elmsInsideMargin() {
    elmsInside.style.marginTop = bucket.getBoundingClientRect().top + 40 + "px"
    elmsInside.style.marginLeft = bucket.getBoundingClientRect().left + "px"
}

function boilWater() {
    document.addEventListener("keypress", async function (e) {
        if (e.key.toLowerCase() == "b") {
            if (kettleHasWater) {
                // Chờ khoảng 2s cho nước sôi mới bốc khối
                await sleep(2000)

                isBoiling = true
                steam.style.opacity = "0.6"

                // sôi khoảng 10s thì hết nước do bốc thành hơi nước chạy ra ngoài
                await sleep(10000)

                steam.style.opacity = "0"
                isBoiling = false
                kettleHasWater = false
                boilTried = true
                visibleConclusion()
            }
            else {
                notification("Ấm không có nước!", 2000)
            }
        }
    })
}

async function waterAnim(obj) {
    flow.style.animation = "waterflow 3s ease"
    await sleep(2000)
    if (obj == bucket) {
        liquid.style.animation = "bucket-liquid-rise 3s ease"
        liquid.addEventListener("animationend", function () {
            liquid.style.height = "60%"
            bucketHasWater = true
            waterType = "liquid"
            returnWaterType(waterType)
        })
    }
    flow.addEventListener("animationend", function () {
        flow.style.animation = "watershrink 1s ease "
        flow.addEventListener("animationend", function () {
            root.style.setProperty("--flowHeight", 0 + "px")
            flow.style.animation = "none"
        })
    })
}
// BỎ XÔ VÀO TỦ LẠNH
function putBucketInFridge() {
    if (bucket.getBoundingClientRect().left > fridge.getBoundingClientRect().left && bucket.getBoundingClientRect().right < fridge.getBoundingClientRect().right) {
        if (bucket.getBoundingClientRect().top > fridge.getBoundingClientRect().top && bucket.getBoundingClientRect().bottom < fridge.getBoundingClientRect().bottom) {
            //adjust outlook
            if (!bucketInFridge && fridgeOpen) {
                bucket.style.opacity = "1"
                bucket.style.top = fridge.getBoundingClientRect().bottom - bucket.getBoundingClientRect().height - 5 + "px"
                bucket.style.left = fridge.getBoundingClientRect().left + 80 + "px"
                bucket.style.width = "100px"
                bucket.style.height = "92.79px"

                bucket.querySelector("img").style.width = "100px"
                bucket.querySelector("img").style.height = "92.79px"

                liquid.style.bottom = "2px"
                liquid.style.left = "6px"

                elmsInside.style.width = "100px"
                elmsInside.style.height = "55px"
                elmsInside.style.marginTop = bucket.getBoundingClientRect().top +40+ "px"
                elmsInside.style.marginLeft = bucket.getBoundingClientRect().left + "px"

                liquid.style.borderRadius = "0px 0px 25px 25px"

                bucketInFridge = true
            }
            else {
                elmsInside.style.width = "150px"
                elmsInside.style.height = "105px"
                elmsInside.style.marginTop = bucket.getBoundingClientRect().top + "px"
                elmsInside.style.marginLeft = bucket.getBoundingClientRect().left + "px"

                bucket.style.width = "150px"
                bucket.style.height = "142.79px"
                bucket.querySelector("img").style.width = "150px"
                bucket.querySelector("img").style.height = "142.79px"
                liquid.style.bottom = "5px"
                liquid.style.left = "10px"
                liquid.style.borderRadius = "0px 0px 40px 40px"

                bucketInFridge = false
            }
        }
    }
}

async function freezeWater() {
    if (bucketInFridge && !fridgeOpen && bucketHasWater) {
        if (waterType == "liquid") {
            while (sec >= 0) {
                notification(`Chờ ${sec} giây nữa để nước đông lại`, 1000)
                await sleep(1000)
                sec--
            }
            notification("Nước đã đông lại thành đá", 3000)
            waterType = "ice"
            returnWaterType(waterType)
        }
        else {
            notification("Thể này không thể đông đá được", 3000)
        }
    }
    else if (bucketInFridge && fridgeOpen && bucketHasWater && waterType == "liquid") {
        notification("Đóng cửa tủ lạnh để nước đông lại nhanh hơn", 3000)
    }
    else if (bucketInFridge && !fridgeOpen && !bucketHasWater) {
        notification("Không có gì trong xô!", 3000)
    }
}

function returnWaterType(type) {
    if (type == "liquid") {
        liquid.style.backgroundColor = "aquamarine"
        liquid.style.backgroundImage = "none"
        elmsInside.src = "./assets/liquid.png"
    }
    else if (type == "ice") {
        liquid.style.backgroundColor = "none"
        liquid.style.backgroundImage = "url(./assets/ice-pattern.jpg)"
        elmsInside.src = "./assets/ice-elms.png"
    }
}

function visibleElmsInside() {
    if (waterType != "none") {
        if (microscope.getBoundingClientRect().right - 30 > bucket.getBoundingClientRect().left && microscope.getBoundingClientRect().left + 30 < bucket.getBoundingClientRect().right) {
            if (microscope.getBoundingClientRect().bottom > bucket.getBoundingClientRect().top + 45 && microscope.getBoundingClientRect().top < bucket.getBoundingClientRect().bottom) {
                if(!bucketInFridge){
                    elmsInside.style.opacity = "1"
                }
                else{
                    elmsInside.style.opacity = "0.6"
                }
                liquid.style.opacity = "0"
            }
            else {
                elmsInside.style.opacity = "0"
                liquid.style.opacity = "1"
            }
        }
        else {
            elmsInside.style.opacity = "0"
            liquid.style.opacity = "1"
        }
    }
    // STEAM
    if (isBoiling) {
        if (microscope.getBoundingClientRect().right - 30 > steamElms.getBoundingClientRect().left && microscope.getBoundingClientRect().left + 30 < steamElms.getBoundingClientRect().right) {
            if (microscope.getBoundingClientRect().bottom > steamElms.getBoundingClientRect().top + 5 && microscope.getBoundingClientRect().top < steamElms.getBoundingClientRect().bottom) {
                microscopeVisiblingSteamElms = true
                steamElms.style.opacity = "1"
                steam.style.opacity = "0"
            }
            else {
                steamElms.style.opacity = "0"
                if(isBoiling){steam.style.opacity = "0.6"}
                microscopeVisiblingSteamElms = false

            }
        }
        else {
            steamElms.style.opacity = "0"
            if(isBoiling){steam.style.opacity = "0.6"}
            microscopeVisiblingSteamElms = false
        }
    }
    else{
        steam.style.opacity = "0"
        steamElms.style.opacity = "0"
    }
}