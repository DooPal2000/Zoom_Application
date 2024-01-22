import http from "http";
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

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
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
});

instrument(wsServer, {
    auth: false,
    mode: "development",
});
  
  

function publicRooms(){
    const {sockets : { adapter : {sids, rooms}}} = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = ws.socket.adapter.rooms;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}


wsServer.on("connection", socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event : ${event}`);
    });
    // ⚠️ done() 함수는 백엔드에서 실행 x 프론트에서 실행 되는 것이다 (헷갈림 주의)
    // 결과적으로, "backend done" 문구는 브라우저 콘솔에 출력된다.
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        console.log(socket.rooms);
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg,room,done)=>{
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on("nickname", nickname=> {
        socket["nickname"] = nickname;
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });    

    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
});


httpServer.listen(3000,handleListen);
