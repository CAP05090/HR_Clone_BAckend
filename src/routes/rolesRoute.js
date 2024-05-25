const RolesModel = require("../models/RolesModel");
const express = require("express");
const rolesRouter = express.Router();

// Add a new role
rolesRouter.post("/add", async (req, res) => {
    const { title, overview, known, skills, experience, description } = req.body;
    try {
        let existingRole = await RolesModel.findOne({ title });
        if (existingRole) {
            return res.status(400).send({ "msg": `Role "${title}" already exists. You can update it instead.` });
        } else {
            let newRole = new RolesModel({ title, overview, known, skills, experience, description });
            await newRole.save();
            return res.status(200).send({ "msg": "Role added successfully." });
        }
    } catch (error) {
        return res.status(400).send({ "msg": error.message });
    }
});

// Get all roles
rolesRouter.get("/", async (req, res) => {
    try {
        const roles = await RolesModel.find();
        return res.status(200).send(roles);
    } catch (error) {
        return res.status(400).send({ "msg": error.message });
    }
});

// Update a role by ID
rolesRouter.patch("/update/:roleId", async (req, res) => {
    const {roleId} = req.params;
    try {
        await RolesModel.findByIdAndUpdate(roleId, req.body);
        return res.status(200).send({ "msg": `Role with ID ${roleId} updated successfully.` });
    } catch (error) {
        return res.status(400).send({ "msg": error.message });
    }
});

// Delete a role by ID
rolesRouter.delete("/delete/:roleId", async (req, res) => {
    const {roleId} = req.params;
    try {
        await RolesModel.findByIdAndDelete(roleId);
        return res.status(200).send({ "msg": `Role with ID ${roleId} deleted successfully.` });
    } catch (error) {
        return res.status(400).send({ "msg": error.message });
    }
});

module.exports = rolesRouter;
