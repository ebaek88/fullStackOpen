import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  eslint.configs.recommended, //JS default recommended config
  ...tseslint.configs.recommendedTypeChecked, //TS default recommended config
  { ignores: ["eslint.config.js"] },
  {
    files: ["**/*.ts", "**/*.tsx"], // included .tsx for the future
    languageOptions: {
      parserOptions: {
        projectService: true, // use projectService now instead of project
        // tsconfigRootDir's default value is the directory of the ESLint config file.
        // I just explicitly set tsconfigRootDir to show that import.meta.dirname is ESModule's equivalent to __dirname
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/semi": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
