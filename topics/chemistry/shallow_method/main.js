const bucket=document.getElementById("container")
const den=document.getElementById("den")
const help=document.getElementById("help")
const batlua=document.getElementById("batlua")
const de=document.getElementById("de")
const steam=document.getElementById("steam")
const ncmuoi=document.getElementById("ncmuoi")
const salt=document.getElementById("muoi")
const sound=document.getElementById("sound")

let moveBucket=false //cho phép xô di chuyển
let moveLight=false  //cho phép đèn dầu di chuyển
let moveBatLua=false  //cho phép bật lửa di chuyển
let batluaClicked=false //đã ấn vào bật lửa (nếu k click khi scroll k chuyển trạng thái)
let startDrying=false //có thể bắt đầu phản ứng
let isHotEnough=false //đèn đã lên lửa
let turnBatLua=false //bật bật lửa
let bucketIsReady=false //xô đã đặt vào đế
let lightIsReady=false  //đèn đã đặt vào đế
let soundPlayed = false


// hiện menu điều khiển
function showControll(){
    alert("Click chuột trái: cầm vật lên và bắt đầu di chuyển vật\nLăn chuột (scroll): bật bật lửa\n*Thao tác:\n -Click vào bật lửa rồi lăn chuột để kích hoạt bật lửa\n -Di chuyển bật lửa lại gần đèn cồn để đốt đèn\n -Đặt cốc trên đế và đèn cồn dưới đế")
}
// hiện kết luận
function visibleConclusion(){
    document.getElementById("conclu").style.opacity="1"
    let isOn=false
    document.getElementById("conclu").addEventListener("click",function(){
        if(!isOn){
            // mouth.speak(speech)
            document.getElementById("text").style.visibility="visible"
            isOn=true;
            sound.src = "./assets/voices/Sau khi cô cạn, ta thu được muối dạng rắn còn nước bốc hơi hết.Khi đun dung dịch muối, nước bốc hơi trong quá trình bay hơi, nhưng muối không thể bay hơi đượ.mp3";
            sound.play();
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

// di chuyển vật thể
function moveObj(obj,move){
    // xét xem người dùng đã bấm vào bật lửa chưa
    obj.addEventListener("click",function(){
        move=false
    })
    document.addEventListener("mousemove",async function(event){
        let mX=event.clientX
        let mY=event.clientY
        // cho obj theo chuột
        if(move==true){
            obj.style.position="absolute"
            if (obj==bucket){
                obj.style.margin="-50vh"
                obj.style.left=mX+obj.getBoundingClientRect().width+"px"
                obj.style.top=mY+"px"
            }
            else{
                obj.style.margin="0"
                obj.style.left=mX-obj.getBoundingClientRect().width/2+"px"
                obj.style.top=mY-obj.getBoundingClientRect().height/2+"px"
            }
        // xét nếu xô nước đang để trên đế
        let startLimitHorizontal=Math.round(de.getBoundingClientRect().left)+80
        let endLimitHorizontal=Math.round((startLimitHorizontal+de.getBoundingClientRect().width))-90
        let startlimitVertical=Math.round(de.getBoundingClientRect().top-260)
  
        if(obj==bucket && startLimitHorizontal<mX && mX<endLimitHorizontal && startlimitVertical<mY && mY<(startlimitVertical+20)){
            bucketIsReady=true
        }
        else if(obj==den && startLimitHorizontal-100<mX && mX<endLimitHorizontal){
            lightIsReady=true
        }
        }   
        // nếu đang cầm bật lửa đang bật thì đèn cháy
        den.addEventListener("mouseover",function(){
            if(turnBatLua && batluaClicked){
            isHotEnough=true
            den.src="./assets/dendaufire.png"

            sound.src = "./assets/fireon.mp3";
            sound.play();
            }
        })
        // phản ứng bốc hơi
        if(bucketIsReady && lightIsReady &isHotEnough && moveBucket==false && moveLight==false){
            ncmuoi.style.animation="dry 12s ease-out"
            steam.style.animation="disappear 10s ease-out"

            ncmuoi.style.height="0px"
            ncmuoi.style.width="160px"

            await sleep(100)
            if(!soundPlayed){
                sound.src = "./assets/boil.mp3";
                sound.play()
                soundPlayed = true;
            }
            steam.addEventListener("animationend",function(){
                bucketIsReady=false
                lightIsReady = false
                visibleConclusion()
            })
        }
    })
}
// di chuyển xô
bucket.addEventListener("click",function(){
    if(moveBucket==true){
        moveBucket=false
    }
    else{
        moveBucket=true
    }
    if(!bucketIsReady){
        moveObj(bucket,moveBucket)
    }
})
// di chuyển đèn dầu
den.addEventListener("click",function(){
    if(moveLight==true){
        moveLight=false
    }
    else{
        moveLight=true
    }
    if(!lightIsReady){
        moveObj(den,moveLight)
    }
})
// di chuyển bật lửa
batlua.addEventListener("click",function(){
    if(batluaClicked==true){
        batluaClicked=false
    }
    else{batluaClicked=true}
     // hiệu ứng ra lửa cho bật lủa
    window.addEventListener("scroll",async function(){
        if(batluaClicked && turnBatLua==false){
            batlua.src="./assets/batluafire.png"
            batlua.style.width="90px"
            await sleep(300)
            turnBatLua=true;
        }
        else{
            batlua.src="./assets/batlua.png"
            batlua.style.width="70px"
            await sleep(300)
            turnBatLua=false
        }
    })
    if(moveBatLua==true){
        moveBatLua=false
    }
    else{
        moveBatLua=true
    }
    moveObj(batlua,moveBatLua)
})