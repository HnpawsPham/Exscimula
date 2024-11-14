// hàm đợi
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const text = document.getElementById("text")
const text2 = document.getElementById("text2")
const ins = document.getElementById("instruct")
const insAudio = document.getElementById("instruct-audio")
const tar = document.getElementById("tar")
const smoke = document.getElementById("smoke")
const part2 = document.getElementById("part2")
const children = document.querySelectorAll(".elm")
let parent = document.getElementById("parent")
const oxy = document.querySelectorAll(".oxy")
let end = false
const co2 = document.querySelectorAll(".co2")
const rit = document.getElementById("rit")
const yellowteeth = document.getElementById("yellowteeth")
let abletoMove = false

// mảng lưu giọng đọc
let voices = [
    {
        audio: "./assets/voices/click vào khói thuốc để bắt đầu.mp3",
        canStart: true
    },
    {
        audio:"./assets/voices/Kéo các chất độc từ miệng qua khí quản đến phổi trái.mp3",
        canStart: true
    },
    {
        audio: "./assets/voices/Kéo chuột vào miệng.mp3",
        canStart: true
    },
    {
        audio: "./assets/voices/Kéo các chất còn lại lên miệng.mp3",
        canStart: true
    },
    {
        audio: "./assets/voices/Xem phản ứng của cơ thể và nicotine ngấm vào.mp3",
        canStart: true
    }
]

// cho giọng đọc thông báo
function runVoices(index){
    if(voices[index].canStart){
        voices[index].canStart = false;
        insAudio.src = voices[index].audio;
        insAudio.play();
    }
}

runVoices(0);

// căn chỉnh
oxy[0].style.margin = "450px 0px 0 670px"
oxy[1].style.margin = "420px 0 0 600px"
oxy[2].style.margin = "550px 30px 0 600px"
oxy[3].style.margin = "490px 10px 0 600px"

co2[0].style.margin = "450px 0px 0 670px"
co2[1].style.margin = "420px 0 0 600px"
co2[2].style.margin = "550px 30px 0 600px"
co2[3].style.margin = "490px 10px 0 600px"
// 
smoke.addEventListener("click", function () {
    smoke.style.opacity = "0"
    ins.innerHTML = "*Kéo chuột vào miệng*"
    runVoices(2);
    movesmoke()
})



let startEvent = true
function movesmoke() {
    document.addEventListener('mousemove', function (event) {
        let mX = event.clientX; // Lấy tọa độ X của chuột
        let mY = event.clientY; // Lấy tọa độ Y của chuột
        // lấy vị trí của phần tử
        parent.style.position = "absolute"
        // check coi có hover vào đường cho phép đi k
        for (let i = 0; i < bounding.length; i++) {
            bounding[i].addEventListener("mouseover", function () {
                abletoMove = true
            })
            bounding[i].addEventListener("mouseout", function () {
                abletoMove = false
            })
        }
        // nếu có thì cho chạy

        if (abletoMove == true) {
            parent.style.left = mX + 2 + "px";
            parent.style.top = mY - 2 + "px";

            // hiện các elm
            for (let i = 0; i < children.length; i++) {
                children[i].style.display = "block"
            }
            if (startEvent) {
                ins.innerHTML = "*Kéo các chất độc từ miệng qua khí quản đến phổi trái*"
                text.innerHTML = "Khi đó ta đưa các chất độc này vào cơ thể"
                runVoices(1);
            }
            moveChild()
        }
    })
}


// di chuyển thành phần thuốc lá  
function moveChild() {
    for (let i = 1; i < children.length; i++) {
        let xPrevious = children[i - 1].getBoundingClientRect().left
        let yPrevious = children[i - 1].getBoundingClientRect().top
        children[i].style.position = "absolute"
        children[i].style.left = xPrevious + "px";
        children[i].style.top = yPrevious + "px";
    }
    combine()

}
// nếu hover vào oxi thì tắt opacity và hiện lên các CO2
let moveto = false
function combine() {
    for (let i = 0; i < oxy.length; i++) {
        oxy[i].addEventListener("mouseover", function () {
            for (let j = 0; j < children.length; j++) {

                oxy[j].style.opacity = "0"
                if (children[j].id != "tar" && children[j].id != "nicotine") {
                    children[j].style.opacity = "0"
                }
                co2[j].style.opacity = "1"
                moveto = true
                smokeControl()
            }
        })
    }
    if (moveto) {
        startEvent = false
        text.innerHTML = "Hút thuốc có thể gây khó thở do CO và C trong thuốc lá kết hợp với O<sub>2</sub> tạo thành CO<sub>2</sub>, từ đó chiếm chỗ O<sub>2</sub> trong phổi" + "<br />" + "<br />" + "2CO+O<sub>2</sub>->2CO<sub>2</sub>" + "<br/>" + "C+O<sub>2</sub>->CO<sub>2</sub>"
        ins.innerHTML = "*Kéo các chất còn lại lên miệng*";
        runVoices(3);
        moveto = false
    }
}
// nếu chuột di chuyển ra khỏi vùng quy định thì elm đứng yên
const bounding = document.querySelectorAll(".bounding")
const char = document.getElementById("char")
function check() {
    for (let i = 0; i < bounding.length; i++) {
        bounding[i].addEventListener("mouseover", function () {
            abletoMove = true
        })
    }
    return abletoMove
}
// fix khi hover vào ptu con mà ở trong bounding vẫn chạy đc
for (let j = 0; j < children.length; j++) {
    children[j].addEventListener("mouseover", function () {
        abletoMove = false
    })
    children[j].addEventListener("mouseout", function () {
        abletoMove = true
    })
}
// điều khiển khói
const part1 = document.getElementById("part1")
function smokeControl() {
    part1.addEventListener("mouseover", function () {
        part1.style.opacity = "0"
        smoke.style.opacity = "1"
        rit.style.opacity = "1"
        tar.style.opacity = "0"
        text.innerHTML = "Khi nhả khói ra, các cặn bã trong khói thuốc bám vào răng. Trong đó, tar là chất nhầy bám vào răng làm răng vàng (tar đã tác dụng khi hút vào)"

        if (!end) {
            ins.innerHTML = "*Xem phản ứng của cơ thể và nicotine ngấm vào*"
            runVoices(4);
        }

        makeYellow()
    })
}

// làm vàng răng
function makeYellow() {
    if (!startEvent) {
        setTimeout(function () {
            yellowteeth.style.opacity = "1"
            smoke.style.opacity = "0"
        }, 2000)
    }
    startEvent = false
}


// hấp thụ nicotine
const nicotine = document.getElementById("nicotine")

function consumeNicotine() {
    yellowteeth.addEventListener("transitionend", async function () {
        await sleep(200)
        nicotine.style.animation = "consume 0.5s ease-in-out"
        document.body.style.animation = "blink 0.5s ease-in-out"
        await sleep(200)
        nicotine.style.opacity = "0"
        text.innerHTML = "<br>Nicotine hấp thụ qua niêm mạc miệng, phế nang phổi hoặc ngấm qua lưỡi khi hít hoặc hút khói thuốc, tạo cảm giác hưng phấn" + "<br />" + "Nó ảnh hưởng rất nhiều đến cơ thể như gây ra tăng nhịp tim, mức hô hấp, huyết áp,...và gây nghiện"
        ins.innerHTML = ""
        end = true
    })

}
consumeNicotine()
