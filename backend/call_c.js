const { exec } = require("child_process");
const path = require("path");

/**
 * Run a compiled C program inside the dsa_c folder
 * @param {string} program - C program name (e.g., "haversine.exe", "sliding_window.exe")
 * @param {string} inputs - arguments for the program (space-separated string)
 * @param {function} callback - callback to handle the result
 */
function runCProgram(program, inputs, callback) {
  // Build absolute path
  const programPath = path.join(__dirname, "dsa_c", program);

  // ✅ Quote the program path so spaces in folder names (like "gautam kanakaraj") don't break
  const command = `"${programPath}" ${inputs || ""}`;

  console.log("⚙️ Executing C program:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Execution error: ${error.message}`);
      callback(`Error: ${error.message}`);
      return;
    }
    if (stderr && stderr.trim().length > 0) {
      console.error(`⚠️ C Program stderr: ${stderr}`);
      callback(`Error: ${stderr}`);
      return;
    }

    callback(stdout.trim()); // clean output
  });
}

module.exports = { runCProgram };
