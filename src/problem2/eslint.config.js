import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  // Test files configuration
  {
    files: [
      "**/*.test.{js,jsx}",
      "**/__tests__/**/*.{js,jsx}",
      "**/test/**/*.{js,jsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vitest globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        test: "readonly",
        // Jest-DOM globals
        toBeInTheDocument: "readonly",
        toHaveAttribute: "readonly",
        // Global test utilities
        globalThis: "readonly",
      },
    },
    rules: {
      // Relax some rules for test files
      "react/display-name": "off",
      "no-unused-vars": "off",
    },
  },
];
