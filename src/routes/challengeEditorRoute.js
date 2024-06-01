const express = require('express');
const { spawn } = require('child_process');
const editorRouter = express.Router();

// Function to execute code
const executeCode = async (language, code, stdin = '') => {
    let command, args;
    switch (language.toLowerCase()) {
        case 'python':
            command = 'python';
            args = ['-c', code];
            break;
        case 'c':
        case 'cpp':
            command = 'docker';
            args = [
                'run', '--rm', '-i', 'gcc',
                'sh', '-c', `echo "${code.replace(/"/g, '\\"')}" | gcc -x ${language} -o /tmp/temp_exec - && /tmp/temp_exec`
            ];
            break;
        case 'r':
            command = 'R';
            args = ['--slave', '-e', code];
            break;
        case 'ruby':
            command = 'ruby';
            args = ['-e', code];
            break;
        case 'javascript':
            command = 'node';
            args = ['-e', code];
            break;
        default:
            throw new Error('Unsupported language');
    }
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        let output = "";
        process.stdin.write(stdin);
        process.stdin.end();
        process.stdout.on("data", (data) => { output += data.toString(); });
        process.stderr.on('data', (data) => { output += data.toString(); });
        process.on('close', (code) => {
            code !== 0 ? reject(output) : resolve(output);
        });
    });
};

// Function to run code submission against test cases
const runTestCases = async (code, language, testCases) => {
    let allTestsPassed = true;
    let outputs = [], expectedOutput = [];

    for (const testCase of testCases) {
        try {
            const output = await executeCode(language, code, testCase.input);
            outputs.push(output.trim());
            expectedOutput.push(testCase.output.trim());
            if (output.trim() !== testCase.output.trim()) allTestsPassed = false;
        } catch (error) {
            allTestsPassed = false;
            outputs.push(error.toString());
        }
    }
    return { allTestsPassed, outputs, expectedOutput };
};

// Route for running code
editorRouter.post('/run', async (req, res) => {
    const { language, code, stdin } = req.body;

    try {
        const output = await executeCode(language, code, stdin);
        res.send({ output });
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

// Route for submitting code
editorRouter.post('/submit', async (req, res) => {
    const { code, language, challengeId } = req.body;
    try {
        const testCases = [
            { input: "home", output: "emoh" },
            { input: "loohcs", output: "school" },
        ];
        const { allTestsPassed, outputs, expectedOutput } = await runTestCases(code, language, testCases);

        if (allTestsPassed) {
            res.send({ success: true, message: 'All test cases passed!', output: outputs, expected: expectedOutput });
        } else {
            res.send({ success: false, message: 'Some test cases failed.', output: outputs, expected: expectedOutput });
        }
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

module.exports = editorRouter;