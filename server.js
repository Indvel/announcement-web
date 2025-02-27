const http = require("http");
const express = require("express");
const path = require("path");

const app = express();

const port = 80; //인스턴스 생성시 만들었던 포트번호 기입

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/gongonotice", (req, res) => {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Date: Date.now()
  });
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.createServer(app).listen(port, () => {
  console.log(`app listening at ${port}`);
});