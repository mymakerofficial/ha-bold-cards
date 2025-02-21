import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/main.ts",
    output: {
      file: "./dist/media-player-tile.js",
      format: "es",
      inlineDynamicImports: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      json(),
      babel({
        exclude: "node_modules/**",
      }),
      terser(),
    ],
  },
];
