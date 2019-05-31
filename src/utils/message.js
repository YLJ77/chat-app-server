function generalMsg(msg, isLoc = false) {
    return {
        msg,
        time: new Date(),
        isLoc
    }
}

module.exports = {
    generalMsg
}