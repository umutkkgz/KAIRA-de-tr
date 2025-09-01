import js from "@eslint/js";

export default [
  {
    ignores: ["js/**"]
  },
  js.configs.recommended,
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly"
      }
    }
  }
];
