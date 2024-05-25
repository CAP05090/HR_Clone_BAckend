const { spawn } = require('child_process');
const editorRouter = require("express").Router()

const safeExec = (command, args, callback) => {
    const process = spawn(command, args);
    let output = ""
    process.stdout.on("data", (data) => {
        output += data.toString();
    });
    process.stderr.on('data', (data) => {
        output += data.toString();
    });
    
    process.on('close', (code) => {
        callback(code, output);
    });
}

editorRouter.post("/run", (req, res) => {
    const { language, code } = req.body;
    let command, args;

    switch (language.toLowerCase()) {
        case 'python':
            command = 'python';
            args = ['-c', code];
            break;
        case 'c':
            // Needs setup to compile code safely, potentially using temp files or Docker
            command = 'gcc';
            args = ['-x', language === 'c' ? 'c' : 'c++', '-o', 'temp', '-'];
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
            return res.status(400).send({ error: 'Unsupported language' });
    }
    safeExec(command, args, (code, output) => {
        if (code !== 0) {
            res.status(500).send({ error: output });
        } else {
            res.send({ output });
        }
    });
})

module.exports = editorRouter;