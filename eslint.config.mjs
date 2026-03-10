import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Turn unused vars into warnings (yellow) instead of errors (red/build fail)
      "@typescript-eslint/no-unused-vars": "warn",

      // ────────────────────────────────────────────────
      // Alternative A: completely disable it (not recommended long-term)
      // "@typescript-eslint/no-unused-vars": "off",

      // Alternative B: keep as error, but ignore variables/parameters prefixed with _
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   {
      //     args: "all",
      //     argsIgnorePattern: "^_",
      //     caughtErrors: "all",
      //     caughtErrorsIgnorePattern: "^_",
      //     destructuredArrayIgnorePattern: "^_",
      //     varsIgnorePattern: "^_",
      //     ignoreRestSiblings: true,
      //   },
      // ],
    },
  }
];

export default eslintConfig;
