// backend/call_c.js
const { exec } = require("child_process");
const path = require("path");

function callC(program, args = []) {
  return new Promise((resolve, reject) => {
    const execPath = path.join(__dirname, "..", "dsa_c", program);

    // Example: ./dsa_c/sliding_window.exe arg1 arg2
    const command = `"${execPath}" ${args.join(" ")}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Execution failed: ${stderr || error.message}`));
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = callC;
