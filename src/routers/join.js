const express = require('express')
const joinRouter = new express.Router()
const { users } = require('../utils/users')

joinRouter.get('/getUsers', (req, res) => {
    res.status(200).send(users)
})

module.exports = joinRouter
