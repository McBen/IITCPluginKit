/* eslint-disable unicorn/filename-case */
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPreferArrow from 'eslint-plugin-prefer-arrow-functions';

const config = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs['flat/recommended'],
    {
        languageOptions: {
            globals: globals.builtin,
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        }
    },
    {
        plugins: { "prefer-arrow-functions": eslintPluginPreferArrow }
    },
    {
        ignores: [
            "eslint.config.js",
            "config/",
            "dist/",
            "types/"
        ]
    },
    {
        // ESLINT rules
        rules: {
            "no-underscore-dangle": "error",
            "prefer-arrow-functions/prefer-arrow-functions": "error"
        },
    },
    {
        // TYPESCRIPT rules
        rules: {
            // disable
            "@typescript-eslint/consistent-type-assertions": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-invalid-void-type": "off", // will report "Promise<void[]>"
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unnecessary-condition": "off", // too much false positives (TS-Bug?)
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/prefer-literal-enum-member": "off", // we use calculated values, ex: enum{ MyEvent = 1+Event.CUSTOM_EVENTS}
            "@typescript-eslint/unbound-method": "off",
            "@typescript-eslint/unified-signatures": "off",
            "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",

            // enable / Tweak
            "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
            "@typescript-eslint/no-duplicate-type-constituents": ["error", { ignoreUnions: true }],
            "@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true, ignoreProperties: true }],
            "@typescript-eslint/no-unsafe-argument": "error",
            "@typescript-eslint/no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false, "argsIgnorePattern": "^_" }],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
            "@typescript-eslint/no-misused-promises": ["error", { "checksVoidReturn": false }],
        },
    },
    {
        // UNICORN rules
        rules: {
            "unicorn/prefer-string-replace-all": "off", // TODO: enable it
            "unicorn/filename-case": ["error",
                {
                    "case": "pascalCase",
                    "ignore": [".*\\.d\\.ts$", "^index(\\.d)?\\.ts$", "^API.*", "\\.schema(\\.ts)?", "\\.spec\\.ts$"]
                }],
            "unicorn/prevent-abbreviations": ["error",
                {
                    "replacements": {
                        "str": { "string": false },
                        "num": { "number": false },
                        "i": { "index": false },
                        "j": { "index": false },
                        "args": false,
                    }
                }],
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-for-each": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/no-lonely-if": "off", // we'll keep "if"s for readability
            "unicorn/numeric-separators-style": "off",
            "unicorn/prefer-dom-node-append": "off",
            "unicorn/prefer-dom-node-remove": "off",
            "unicorn/prefer-number-properties": "off",
            "unicorn/prefer-query-selector": "off", // nah, just not my style
            "unicorn/prefer-string-raw": "off",
            "unicorn/switch-case-braces": "off",
        },
    }
);

// config.forEach(c => { if (c.rules) c.rules = { "@typescript-eslint/no-extraneous-class": "error" } })

// yarn eslint . --report-unused-disable-directives-severity=0 --format node_modules/eslint-summary/summary.js
// yarn eslint . --report-unused-disable-directives-severity=0

export default config;

/*
export default [{

        "rules": {
            // TYPESCRIPT
            "@typescript-eslint/array-type": "error",
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
    
            "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }],
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/quotes": ["error", "double", { "avoidEscape": true }],
            "@typescript-eslint/require-array-sort-compare": ["error", { "ignoreStringArrays": true }],
            "arrow-parens": ["error", "as-needed"],
            "comma-dangle": "error",
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
            "max-classes-per-file": ["error", 1],
            "max-len": ["error", { "code": 160 }],
            "new-parens": "error",
            "no-bitwise": "error",
            "no-caller": "error",
            "no-cond-assign": "error",
            "no-debugger": "error",
            "no-empty": "error",
            "no-eval": "error",
            "no-multiple-empty-lines": ["error", { "max": 3 }],
            "no-new-wrappers": "error",
            "no-throw-literal": "error",
            "no-trailing-spaces": "error",
            "no-undef-init": "error",
            "no-unsafe-finally": "error",
            "no-unused-expressions": "error",
            "no-unused-labels": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-arrow/prefer-arrow-functions": "error",
            "spaced-comment": "error",
            "use-isnan": "error",
    
            // UNICORN
            "unicorn/filename-case": ["error",
                {
                    "case": "pascalCase",
                    "ignore": [".*\\.d\\.ts$", "^index(\\.d)?\\.ts$", "^API.*", "\\.schema(\\.ts)?", "\\.spec\\.ts$"]
                }],
        }
}]; */


