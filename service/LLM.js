const { spawn } = require("child_process");
const path = require("path");

class PythonProcessManager {
  constructor() {
    this.workerPool = [];
    this.maxWorkers = 1; // Adjust based on CPU cores
    this.requestQueue = [];
    this.initWorkerPool();
  }

  initWorkerPool() {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.addWorker();
    }
  }

  addWorker() {
    const worker = {
      process: this.spawnPythonProcess(),
      busy: false,
      currentRequest: null,
    };

    let buffer = "";

    worker.process.stdout.on("data", (data) => {
      buffer += data.toString();
      const messages = buffer.split("\n");
      buffer = messages.pop() || "";

      messages.forEach((rawMessage) => {
        try {
          const message = JSON.parse(rawMessage);
          if (worker.currentRequest) {
            worker.currentRequest.resolve(message);
            worker.currentRequest = null;
          }
          worker.busy = false;
          this.processQueue();
        } catch (e) {
          console.error("Message parse error:", e);
        }
      });
    });

    worker.process.stderr.on("data", (data) => {
      console.error(`Python Error [${worker.process.pid}]: ${data}`);
    });

    worker.process.on("exit", (code) => {
      console.log(`Python worker ${worker.process.pid} exited (${code})`);
      this.replaceWorker(worker);
    });

    this.workerPool.push(worker);
  }

  spawnPythonProcess() {
    const scriptPath = path.join(__dirname, "llm.py");
    return spawn(process.platform === "win32" ? "python" : "python3", [
      "-u",
      scriptPath,
    ]);
  }

  replaceWorker(worker) {
    const index = this.workerPool.indexOf(worker);
    if (index > -1) {
      this.workerPool.splice(index, 1);
      this.addWorker();
    }
  }

  processQueue() {
    while (
      this.requestQueue.length > 0 &&
      this.workerPool.some((w) => !w.busy)
    ) {
      const { question, resolve, reject } = this.requestQueue.shift();
      this.executeRequest(question, resolve, reject);
    }
  }

  executeRequest(question, resolve, reject) {
    const worker = this.workerPool.find((w) => !w.busy);
    if (!worker) {
      this.requestQueue.push({ question, resolve, reject });
      return;
    }

    worker.busy = true;
    const timeout = setTimeout(() => {
      worker.process.kill();
      this.replaceWorker(worker);
      reject(new Error("Python response timeout"));
    }, 10000);

    worker.currentRequest = {
      resolve: (result) => {
        clearTimeout(timeout);
        resolve(result);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    };

    try {
      worker.process.stdin.write(JSON.stringify(question) + "\n");
    } catch (e) {
      this.replaceWorker(worker);
      reject(new Error(`Write error: ${e.message}`));
    }
  }

  ask(question) {
    return new Promise((resolve, reject) => {
      this.executeRequest(question, resolve, reject);
    });
  }

  destroy() {
    this.workerPool.forEach((worker) => {
      worker.process.kill();
    });
    this.workerPool = [];
  }
}

// Singleton instance
const processManager = new PythonProcessManager();
module.exports = { respond: (q) => processManager.ask(q) };
