// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {ignores: ["**/*.test.ts"]},
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.strict, {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-namespace": "off",
    },
  }),
];
