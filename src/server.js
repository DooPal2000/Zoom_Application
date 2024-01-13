import http from "http";
import WebSocket, {WebSocketServer} from "ws";
import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/src/public"));

app.get("/",(req,res) => {
    res.render("home")
});

app.get("/*", (req,res) => {
    res.redirect("/")
});


const handleListen = () => console.log('Listening on port 3000');

//http 서버와 webSocket 서버를 둘 다 만든 경우임
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.send("hello!")
    console.log(socket);
});

server.listen(3000,handleListen);



// app.listen(3000, handleListen);