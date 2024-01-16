import http from "http";
import { Server } from 'socket.io';

// import WebSocket, {WebSocketServer} from "ws";

import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.set('view engine', "pug");

if (process.env.NODE_ENV === "development") {
    app.set("views", __dirname + "/src/views");
    app.use("/public", express.static(__dirname + "/src/public"));

} else {
    app.set("views", __dirname + "/views");
    app.use("/public", express.static(__dirname + "/public"));
}
  

app.get("/",(req,res) => {
    res.render("home")
});

app.get("/*", (req,res) => {
    res.redirect("/")
});


const handleListen = () => console.log('Listening on port 3000');

const httpServer = http.createServer(app);
const wsServer =  new Server(httpServer);

wsServer.on("connection", socket => {
    // ⚠️ done() 함수는 백엔드에서 실행 x 프론트에서 o 실행 되는 것이다 (헷갈림 주의)
    // 결과적으로, "backend done" 문구는 브라우저 콘솔에 출력된다.
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            done(`hello ${roomName}'s user, It's me. (from the backend)`); 
        }, 5000);
    });
});


httpServer.listen(3000,handleListen);
