const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(cors())
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    socket.emit('message', 'welcome')
    socket.broadcast.emit('message', '一个新的用户加入')

    socket.on('sendMessage', (msg) => {
        // socket.emit('message', count)
        io.emit('message', msg)
    })
    socket.on('sendLocation', (pos) => {
        io.emit('message', `https://google.com/maps?q=${ pos.latitude },${ pos.longitude }`)
    })
    socket.on('disconnect', () => {
        io.emit('message', '一个用户退出了');
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})