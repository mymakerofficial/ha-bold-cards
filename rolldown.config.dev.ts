import baseConfig from "./rolldown.config";
import { defineConfig, type RolldownPluginOption } from "rolldown";
import serve from "rollup-plugin-serve";

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...(baseConfig.plugins as RolldownPluginOption[]),
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
});
