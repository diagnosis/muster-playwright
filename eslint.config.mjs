// eslint.config.mjs
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default tseslint.config(
    { ignores: ['node_modules', 'playwright-report', 'test-results', 'eslint.config.mjs'] },

    // TypeScript rules for all source and test files
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
        },
        rules: {
            // a promise that is neither awaited nor returned
            '@typescript-eslint/no-floating-promises': 'error',
        },
    },

    // Playwright rules, only for test files
    {
        files: ['tests/**/*.ts'],
        extends: [playwright.configs['flat/recommended']],
        rules: {
            'playwright/expect-expect': ['warn', {
                assertFunctionNames: ['expectLoggedIn', 'expectLoggedOut'],
            }],
        },
    },
)