const users = []

const addUser = ({ id, username, room }) => {
    // 清洗数据
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // 验证数据
    if (!username || !room) {
        return {
            error: '无效的用户名或房间'
        }
    }

    // 检查已存在的用户
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // 验证用户名
    if (existingUser) {
        return {
            error: '用户名已存在!'
        }
    }

    // 储存用户
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}