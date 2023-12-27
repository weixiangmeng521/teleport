module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
        "no-shadowed-variable": 0,
        "object-literal-shorthand": 0,
        "no-unused-expression": 0,
        "no-empty": 0,
        "only-arrow-functions": 0,
        "unified-signatures": 0,
        "prefer-for-of": 0,
        "max-classes-per-file": 0,
        "@typescript-eslint/no-explicit-any": 'off',
        "@typescript-eslint/no-unused-vars": "off",
        
    },
  };
  