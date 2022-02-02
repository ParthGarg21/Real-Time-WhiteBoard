const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));

const port = 3000;

const server = app.listen(port, function () {
  console.log("Server running at port : " + port);
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made scoket connection!!");

  socket.on("drawHelper", function (data) {
    io.sockets.emit("drawHelper", data);
  });

  socket.on("reset", function (data) {
    io.sockets.emit("reset", data);
  });

  socket.on("colorW", function (colorW) {
    io.sockets.emit("colorW", colorW);
  });

  socket.on("equate", function (data) {
    io.sockets.emit("equate", data);
  });

  socket.on("triggerUndo", function (data) {
    io.sockets.emit("triggerUndo", data);
  });

  socket.on("triggerRedo", function (data) {
    io.sockets.emit("triggerRedo", data);
  });
});
