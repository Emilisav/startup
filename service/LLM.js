const { spawn } = require("child_process");
const path = require("path");

let pythonProcess = null;

function getPythonProcess() {
  if (!pythonProcess) {
    pythonProcess = spawn("python3", ["-u", path.join(__dirname, "llm.py")]);

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess = null;
    });
  }
  return pythonProcess;
}

async function respond(question) {
  return new Promise((resolve, reject) => {
    const proc = getPythonProcess();
    const handler = (data) => {
      try {
        const result = JSON.parse(data.toString());
        if (result.error) reject(result.error);
        resolve(result.response);
        proc.stdout.off("data", handler);
      } catch (e) {
        reject(e);
      }
    };

    proc.stdout.on("data", handler);
    proc.stdin.write(JSON.stringify({ question }) + "\n");
  });
}

module.exports = { respond };
