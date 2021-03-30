module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        jquery: true,
        greasemonkey: true
    },
    // ignorePatterns: ["config/", "tests/", "scripts/", "out/"],

    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:unicorn/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        ecmaVersion: 6,
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "prefer-arrow",
        "import",
        "unicorn"
    ],
    "rules": {
        // TYPESCRIPT
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/consistent-type-assertions": "off",
        "@typescript-eslint/explicit-member-accessibility": ["off", { "accessibility": "explicit" }],
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/member-ordering": ["error", {
            "default": [
                "static-field",
                "instance-field",
                "public-static-method",
                "constructor"
            ]
        }],

        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false, "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/quotes": ["error", "double", { "avoidEscape": true }],
        "@typescript-eslint/unified-signatures": "error",
        "@typescript-eslint/unbound-method": ["warn", { "ignoreStatic": true }],
        "arrow-parens": ["error", "as-needed"],
        "camelcase": "off", // catch by typescript
        "comma-dangle": "error",
        "complexity": "off",
        "constructor-super": "error",
        "curly": ["error", "multi-line"],
        "dot-notation": "error",
        "eqeqeq": ["error", "smart"],
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined"
        ],
        "id-match": "error",
        "import/no-default-export": "error",
        "import/order": "off",
        "max-classes-per-file": ["error", 1],
        "max-len": ["error", { "code": 160 }],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "off",
        "no-debugger": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": ["error", { "max": 3 }],
        "no-new-wrappers": "error",
        "no-shadow": ["error", { "hoist": "all" }],
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "prefer-arrow/prefer-arrow-functions": "error",
        "radix": "off",
        "spaced-comment": "error",
        "use-isnan": "error",
        "valid-typeof": "off",

        // UNICORN
        "unicorn/better-regex": "off",
        "unicorn/filename-case": ["error",
            {
                "case": "pascalCase",
                "ignore": ["^index\\.ts$", "^API.*", "\\.schema(\\.ts)?"]
            }],
        "unicorn/prefer-ternary": "off",
        "unicorn/no-lonely-if": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-array-for-each": "off",

        "unicorn/no-reduce": "off",
        "unicorn/no-nested-ternary": "off",
        "unicorn/no-fn-reference-in-iterator": "off",
        "unicorn/prefer-number-properties": "off",
        "unicorn/prefer-node-append": "off",
        "unicorn/prefer-node-remove": "off",
        "unicorn/prefer-spread": "off",
        "unicorn/prevent-abbreviations": ["error",
            {
                "replacements": {
                    "str": { "string": false },
                    "num": { "number": false },
                    "i": { "index": false },
                    "j": { "index": false },
                }
            }]
    }
};
