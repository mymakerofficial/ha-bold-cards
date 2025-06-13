import { spawn } from "child_process";

export default function eslintPlugin(options = {}) {
  const { failOnError = true, fix = false } = options;

  return {
    name: "eslint",

    buildStart() {
      return new Promise((resolve, reject) => {
        const args = ["run", "lint"];
        if (fix) {
          args.push("--", "--fix");
        }

        const eslint = spawn("npm", args, {
          stdio: "inherit",
          shell: true,
        });

        eslint.on("error", (err) => {
          if (failOnError) {
            reject(new Error(`Failed to run ESLint: ${err.message}`));
            return;
          }

          this.warn(`Failed to run ESLint: ${err.message}`);
          resolve();
        });

        eslint.on("close", (code) => {
          if (code === 0) {
            resolve();
            return;
          }

          if (failOnError) {
            reject(new Error("ESLint found errors"));
            return;
          }

          this.warn("ESLint found errors");
          resolve();
        });
      });
    },
  };
}
