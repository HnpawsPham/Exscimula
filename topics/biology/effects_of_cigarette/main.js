const sound = document.getElementById("sound")
// nếu click biểu tượng ? thì hiện hướng dẫn
const show = document.getElementById("show")

show.addEventListener('click', function () {
    document.getElementsByTagName('p')[0].style.opacity = '1'
    document.getElementsByTagName('p')[1].style.opacity = '1'
    document.getElementsByTagName('p')[2].style.opacity = '1'
})
show.addEventListener("dblclick", function () {
    document.getElementsByTagName('p')[0].style.opacity = '0'
    document.getElementsByTagName('p')[1].style.opacity = '0'
    document.getElementsByTagName('p')[2].style.opacity = '0'
})
// nếu click chữ bỏ qua thì qua luôn file kết luận
const skip = document.getElementById('skip')
skip.addEventListener('click', () => {
    window.location.href = "../thuoc_la/thuoclagame1.html";
})
function movecig() {
    document.addEventListener('mousemove', function (event) {
        let mX = event.clientX; // Lấy tọa độ X của chuột
        let mY = event.clientY; // Lấy tọa độ Y của chuột
        // lấy vị trí của phần tử
        const cig = document.getElementById('thuocla')
        cig.style.opacity = '1'
        cig.style.left = mX + "px";
        cig.style.top = mY + "px";
    })
}
// tạo hiệu ứng hút thuốc
// khai báo
const Csprites = [
    './cigar/1.png',
    './cigar/2.png',
    './cigar/3.png',
    './cigar/4.png',
    './cigar/5.png',
    './cigar/6.png',
    './cigar/7.png'
]
let i = 0
const lungs = document.getElementById('lungs')
const cig = document.getElementById('thuocla')
const cigBox = document.getElementById('baothuoc')
level = 90;


// hiệu ưungs
function startanim() {
    cig.src = Csprites[i];
    i++
    if (i < 8) {
        sound.play()
        setTimeout(startanim, 300)
    }
    else if (i == 8) {
        // càng hút phổi càng đen
        lungs.style.filter = 'brightness(' + level + '%)'
        level -= 15
    }
    if (level <= -15) {
        if (confirm("Đi tiếp?")) {
            window.location.href = "../thuoc_la/thuoclagame1.html";
        } else {
        }
    }
}
// bấm lại vào bao thuốc thì reset 
cigBox.addEventListener('click', function (event) {
    i = 0
    cig.src = Csprites[0];
})

