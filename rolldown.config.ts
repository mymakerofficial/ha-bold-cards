import { defineConfig } from "rolldown";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";

export default defineConfig({
  input: "src/main.js",
  output: {
    file: "./dist/bold-cards.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    json(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
});
