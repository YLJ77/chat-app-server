const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (msg, callback) => {
        // socket.emit('message', count)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('不允许出现粗俗语言');
        }
        io.emit('message', msg)
        callback('信息发送成功');
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