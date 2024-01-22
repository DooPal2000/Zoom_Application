const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
         const currentCamera = myStream.getVideoTracks()[0];
        // console.log(myStream.getVideoTracks());
        cameras.forEach(camera => { 
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label == camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch(e){
        console.log(e)
    }
}

async function getMedia(deviceId){
    // 처음 웹페이지 접속 시 기본설정
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },         
    };
    // 옵션을 통해 기기 변경 시 deviceId 변경
    const cameraConstrains = {
        audio: true,
        video: {  deviceId: { exact: deviceId } },     
    };

    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains    
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }

        //console.log(myStream);
    } catch(e){
        console.log(e);
    }

}
getMedia();

function handleMuteClick(){
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled))
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick(){    
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled))
    // console.log(myStream.getVideoTracks());
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}
async function handleCameraChange (){
    await getMedia(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input",handleCameraChange);