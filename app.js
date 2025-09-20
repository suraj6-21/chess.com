const express = require("express")
const socket = require("socket.io")
const http = require("http")
const { Chess } = require("chess.js")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = socket(server)

const chess = new Chess()
let players = {}
let currentPlayer = "w"

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" })
})

io.on("connection", (uniqueSocket) => {
    console.log("Connected")

    if (!players.white) {
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w")
    }
    else if (!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b")
    }
    else {
        uniqueSocket.emit("spectatorRole")
    }
})

server.listen(3000, () => {
    console.log(`Server is running on Port 3000`)
})
