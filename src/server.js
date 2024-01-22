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



app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
  

const handleListen = () => console.log('Listening on port 3000');

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
wsServer.on("connection", socket => {
    socket.on("join_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    })
})

httpServer.listen(3000, handleListen);
