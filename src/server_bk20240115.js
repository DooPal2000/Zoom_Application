import http from "http";
import WebSocket, {WebSocketServer} from "ws";



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

const server = http.createServer(app);
const wsServer =  new WebSocketServer(httpServer);
const wss = new WebSocketServer({ server });

const sockets = [];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser✔️");
    socket.on("close", ()=> { console.log("Disconnected from the Browser ❌") });
    socket.on("message", msg =>  {
        const message = JSON.parse(msg);
        switch(message.type){ 
            case "new_message":
                //forEach를 통해, 여러 사용자 접속 + 메세지 전송시 모든 소켓에게 메세지 전송
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload} `));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                console.log(message.payload);
                break;
        }
        //socket.send(message);
        //console.log(message.toString());
    });
});


server.listen(3000,handleListen);
