import js from "@eslint/js";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: [".next/**", "node_modules/**", ".data/**"] },
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }] },
  },
];
