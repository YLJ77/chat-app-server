const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const Filter = require('bad-words')
const { generalMsg } = require('./utils/message')
const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./utils/users')
const joinRouter = require('./routers/join')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(cors())
app.use(joinRouter)
app.use(express.json())
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    io.emit('roomMayChange', users)
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })
        const adName = 'admin'

        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generalMsg({ msg: 'welcome', name: adName }));  // 仅自己可见
        socket.broadcast.to(user.room).emit('message', generalMsg({ msg: `${user.name} 加入聊天室`, name: adName }))  // 除了自己其他人都可见
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        io.emit('roomMayChange', users)
        callback();

    })
    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('不允许出现粗俗语言');
        }
        io.to(user.room).emit('message', generalMsg({ msg, name: user.name }))  // 所有人可见
        callback('信息发送成功');
    })
    socket.on('sendLocation', (pos, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generalMsg({ msg: `https://google.com/maps?q=${ pos.latitude },${ pos.longitude }`, isLoc: true, name: user.name }))
        callback('位置已分享');
    })
    socket.on('disconnect', () => {
        let user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generalMsg({ msg: `${ user.name } 已离开`, name: 'admin' }));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            io.emit('roomMayChange', users)
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})