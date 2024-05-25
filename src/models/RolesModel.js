const mongoose = require("mongoose")

const rolesSchema = new mongoose.Schema({
    title:{type:String, required: true},
    overview:{type:String, required: true},
    known:{type:[String]},
    skills:{type:[String]},
    experience:{type: Number},
    description:{type: Object}
}, {
    versionKey: false
})

const RolesModel = mongoose.model("role", rolesSchema)

module.exports = RolesModel;