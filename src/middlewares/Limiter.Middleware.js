const rateLimiter = require("express-rate-limit")

const limiter = rateLimiter({
    window: 10*60*1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
})

module.exports = {limiter}