const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token: String,
    date:{type:Date, default:Date.now}
}, {
    versionKey: false
})

const BlackListModel = mongoose.model("blacklistToken", blacklistSchema)

module.exports = { BlackListModel }