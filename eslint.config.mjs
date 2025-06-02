import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "no-restricted-imports": [
        "warn",
        {
          name: "superstruct",
          message: "Use 'zod' instead of 'superstruct'.",
        },
        {
          name: "zod/v4",
          message: "zod v4 is not supported. Use 'zod' instead.",
        },
      ],
      "no-restricted-syntax": [
        "warn",
        {
          message:
            "Don't use 'z.enum' directly. Use our custom 'enums' function instead.",
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.name='z'][callee.property.name='enum']",
        },
        {
          message:
            "Don't use 'z.nativeEnum' directly. Use our custom 'enums' function instead.",
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.name='z'][callee.property.name='nativeEnum']",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
