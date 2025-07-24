// import js from "@eslint/js";
// import globals from "globals";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";


// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
//   pluginReact.configs.flat.recommended,
// ]);


import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import securityNode from "eslint-plugin-security-node";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuration for JavaScript and JSX files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: {...globals.browser, ...globals.node},
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: pluginReact,
      security: pluginSecurity,
      securityNode: securityNode,
      noUnsanitized: noUnsanitized,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      "security/detect-eval-with-expression": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  },
  
  // Configuration for TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
      security: pluginSecurity,
      securityNode: securityNode,
      noUnsanitized: noUnsanitized,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      "security/detect-eval-with-expression": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  
  // // Configuration for test files
  // {
  //   files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
  //   languageOptions: {
  //     globals: {...globals.browser, ...globals.node, ...globals.jest}
  //   },
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off" // Allow any in tests
  //   }
  // }
];
