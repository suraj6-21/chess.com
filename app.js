const express = require("express")
const socket = require("socket.io")
const http = require("http")
const { Chess } = require("chess.js")


const app = express()
const server = http.createServer(app)
const io = socket(server)