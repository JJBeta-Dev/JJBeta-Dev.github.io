import js from '@eslint/js'
import jsdoc from 'eslint-plugin-jsdoc'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Regla local: el proyecto solo admite comentarios de documentación (bloques TSDoc/JSDoc).
 * Cualquier comentario de línea `//` o de bloque normal se reporta como error.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const onlyDocComments = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { banned: 'Solo se permiten comentarios de documentación (/** … */).' },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          const isDoc = comment.type === 'Block' && comment.value.startsWith('*')
          if (!isDoc) context.report({ loc: comment.loc, messageId: 'banned' })
        }
      },
    }
  },
}

const local = { rules: { 'only-doc-comments': onlyDocComments } }

const documentation = {
  'jsdoc/require-jsdoc': [
    'error',
    {
      publicOnly: false,
      require: {
        FunctionDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
        MethodDefinition: true,
      },
      contexts: [
        'VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
        'VariableDeclaration > VariableDeclarator > FunctionExpression',
      ],
      checkConstructors: false,
    },
  ],
  'jsdoc/require-description': 'error',
  'jsdoc/require-param': ['error', { checkDestructured: false }],
  'jsdoc/require-param-type': 'error',
  'jsdoc/require-param-description': 'error',
  'jsdoc/check-param-names': ['error', { checkDestructured: false }],
  'jsdoc/require-returns': ['error', { forceReturnsWithAsync: true }],
  'jsdoc/require-returns-type': 'error',
  'jsdoc/require-returns-description': 'error',
  'jsdoc/require-example': 'error',
  'jsdoc/check-tag-names': 'error',
  'jsdoc/no-types': 'off',
}

export default tseslint.config(
  { ignores: ['build', 'coverage', 'html', '.react-router', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: { jsdoc: { mode: 'typescript' } },
    plugins: { 'react-hooks': reactHooks, jsdoc, local },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'local/only-doc-comments': 'error',
      ...documentation,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ regex: '^[.]{1,2}/(?![+]types/)', message: 'Usa los alias @/ o @test/.' }] },
      ],
    },
  },
  {
    files: ['test/**/*.{ts,tsx}'],
    rules: { 'jsdoc/require-jsdoc': 'off', 'jsdoc/require-example': 'off' },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    plugins: { jsdoc, local },
    languageOptions: { globals: { ...globals.node } },
    rules: { 'local/only-doc-comments': 'error', ...documentation },
  },
)
