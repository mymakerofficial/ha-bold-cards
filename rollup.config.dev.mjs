import serve from "rollup-plugin-serve";
import { defaultConfig } from "./rollup.config.mjs";

export default {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    serve({
      contentBase: "./dist",
      host: "0.0.0.0",
      port: 5059,
      allowCrossOrigin: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }),
  ],
};
