import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import eslintPlugin from "./plugins/eslint.js";

const ignoreWarnings = ["THIS_IS_UNDEFINED", "CIRCULAR_DEPENDENCY"];

export const defaultConfig = {
  input: "src/main.ts",
  output: {
    file: "./dist/bold-cards.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    eslintPlugin({
      failOnError: true,
      fix: false,
    }),
  ],
  onwarn: (warning, warn) => {
    if (ignoreWarnings.includes(warning.code)) {
      return;
    }
    warn(warning);
  },
};

export default [
  {
    ...defaultConfig,
    plugins: [
      ...defaultConfig.plugins,
      babel({
        exclude: "node_modules/**",
      }),
      terser(),
    ],
  },
];
