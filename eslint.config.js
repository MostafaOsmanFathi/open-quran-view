import js from '@eslint/js';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: parser,
            globals: {
                ...globals.browser,
                window: 'readonly',
                document: 'readonly',
                URL: 'readonly',
                HTMLElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLButtonElement: 'readonly',
                CustomEvent: 'readonly',
                customElements: 'readonly',
                fetch: 'readonly',
                console: 'readonly',
                vi: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                global: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: '18',
            },
        },
        plugins: {
            '@typescript-eslint': plugin,
            'react-hooks': hooksPlugin,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...plugin.configs.recommended.rules,
            ...hooksPlugin.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react-hooks/set-state-in-effect': 'off',
        },
    },
];
