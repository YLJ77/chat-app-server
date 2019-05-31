function generalMsg({ msg, isLoc = false, name }) {
    return {
        msg,
        time: new Date(),
        isLoc,
        name
    }
}

module.exports = {
    generalMsg
}