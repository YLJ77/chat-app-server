const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const Filter = require('bad-words')
const { generalMsg } = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(cors())
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ name, room }) => {
        socket.join(room)
        socket.emit('message', generalMsg('welcome'));  // 仅自己可见
        socket.broadcast.to(room).emit('message', generalMsg(`${name} 加入聊天室`))  // 除了自己其他人都可见

    })
    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('不允许出现粗俗语言');
        }
        io.emit('message', generalMsg(msg))  // 所有人可见
        callback('信息发送成功');
    })
    socket.on('sendLocation', (pos, callback) => {
        io.emit('message', generalMsg(`https://google.com/maps?q=${ pos.latitude },${ pos.longitude }`, true))
        callback('位置已分享');
    })
    socket.on('disconnect', () => {
        io.emit('message', generalMsg('一个用户退出了'));
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})