const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    status:{type:String, required: true},
    skills: { type: String, required: true },
    difficulty: { type: String, required: true },
    subDomain: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    example: [{ type: String }],
    functionDescription: [{ type: String }],
    print: { type: String },
    inputFormat: [{ type: String }],
    constraints: [{ type: String }],
    outputFormat: [{ type: String }],
    sampleInput: {type: [String]},
    sampleOutput: [{type: String}],
    explanation: { type: [String]},
    hints: { type: String }
}, { versionKey: false });

const QuestionModel = mongoose.model("Question", questionSchema);

module.exports = QuestionModel;
