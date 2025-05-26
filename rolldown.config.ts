import { defineConfig } from "rolldown";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  input: "src/main.js",
  output: {
    file: "./dist/bold-cards.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [nodeResolve()],
});
