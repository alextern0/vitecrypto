module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "array-callback-return": ["error", {"allowImplicit": false, "checkForEach": true}],
        "no-await-in-loop": "error",
        "no-constant-binary-expression": "error",
        "no-promise-executor-return": ["error", { "allowVoid": true }],
        "no-self-compare": "error",
        "no-duplicate-imports": ["error", { "includeExports": true }],
        "no-new-native-nonconstructor": "error",
        "no-template-curly-in-string": "error",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off"
    }
}
