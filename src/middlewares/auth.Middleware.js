const jwt = require("jsonwebtoken")
const { BlackListModel } = require("../models/BlackListModel")
const dotenv = require("dotenv").config()

const auth = async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if(token){
        const blackToken = await BlackListModel.findOne({token})
        if(blackToken){
            res.send("Please Login ...")
        } else{
            jwt.verify(token, process.env.AccessKey, (err, decoded) => {
                if(err){
                    res.send("Token Expires")
                } else{
                    req.body.userId = decoded.userId
                    next()
                }
            })
        }
    } else{
        res.send("Token not Found")
    }
}

module.exports = {auth}