alert('hi!')
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open",() => {
    console.log("Connected to Server OOOOO");
});

socket.addEventListener("message", (message) => {
    console.log("Just Got this: ", message, "from the Server");
});

socket.addEventListener("close",() => {
    console.log("Connect from Server XXXXX");
});