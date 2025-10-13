const { spawn } = require("child_process");
const path = require("path");

async function buildApp() {
  try {
    console.log("Installing frontend dependencies...");

    // Install frontend dependencies first
    const installProcess = spawn("npm", ["install"], {
      cwd: path.resolve(__dirname, "frontend"),
      stdio: "inherit",
    });

    await new Promise((resolve, reject) => {
      installProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Install failed with code ${code}`));
        }
      });
    });

    console.log("Building frontend...");

    // Use node to run vite build directly
    const buildProcess = spawn(
      "node",
      ["node_modules/vite/bin/vite.js", "build"],
      {
        cwd: path.resolve(__dirname, "frontend"),
        stdio: "inherit",
      }
    );

    await new Promise((resolve, reject) => {
      buildProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Build completed successfully!");
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildApp();
