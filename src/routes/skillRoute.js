const { SkillsModel } = require("../models/SkillsModel");
const skillRouter = require("express").Router();

// Retrieve all skills
skillRouter.get("/", async (req, res) => {
    try {
        const skills = await SkillsModel.find();
        res.send({ skills });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
});

// Create a new skill
skillRouter.post("/create", async (req, res) => {
    const { title, skillslevel, description, keycompetencies } = req.body;
    try {
        const existingSkill = await SkillsModel.findOne({ title, skillslevel });
        if (existingSkill) {
            res.status(400).send({ msg: `Skill '${existingSkill.title} ${existingSkill.skillslevel}' already exists. You can update or delete it.` });
        } else {
            const skill = new SkillsModel({ title, skillslevel, description, keycompetencies });
            await skill.save();
            res.status(201).send({ msg: "Skill data added successfully" });
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
});

// Update an existing skill
skillRouter.patch("/update/:skillId", async (req, res) => {
    const { skillId } = req.params;
    try {
        await SkillsModel.findByIdAndUpdate(skillId, req.body);
        res.send({ msg: `Skill with ID '${skillId}' has been updated` });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
});

// Delete an existing skill
skillRouter.delete("/delete/:skillId", async (req, res) => {
    const { skillId } = req.params;
    try {
        await SkillsModel.findByIdAndDelete(skillId);
        res.send({ msg: `Skill with ID '${skillId}' has been deleted` });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
});

module.exports = { skillRouter };
