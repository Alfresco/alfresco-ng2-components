path = require('path');
module.exports = {
  extends: '../.eslintrc.js',
  ignorePatterns: [
    '!**/*'
  ],
  overrides: [
    {
      files: [
        '*.ts'
      ],
      parserOptions: {
        project: [
          path.join(__dirname, 'tsconfig.app.json'),
          path.join(__dirname, 'src/tsconfig.spec.json'),
          path.join(__dirname, 'e2e/tsconfig.e2e.json')
        ],
        createDefaultProgram: true
      },
      plugins: [
        'eslint-plugin-unicorn',
        'eslint-plugin-rxjs'
      ],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: [
              'adf',
              'app'
            ],
            style: 'kebab-case'
          }
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: [
              'element',
              'attribute'
            ],
            prefix: [
              'adf',
              'app'
            ],
            style: 'kebab-case'
          }
        ],
        '@angular-eslint/no-host-metadata-property': 'off',
        '@angular-eslint/no-input-prefix': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit'
          }
        ],
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        'brace-style': [
          'error',
          '1tbs'
        ],
        'comma-dangle': 'error',
        'default-case': 'error',
        'import/order': 'off',
        'max-len': [
          'error',
          {
            code: 240
          }
        ],
        'no-bitwise': 'off',
        'no-duplicate-imports': 'error',
        'no-multiple-empty-lines': 'error',
        'no-redeclare': 'error',
        'no-return-await': 'error',
        'rxjs/no-create': 'error',
        'rxjs/no-subject-unsubscribe': 'error',
        'rxjs/no-subject-value': 'error',
        'rxjs/no-unsafe-takeuntil': 'error',
        'unicorn/filename-case': 'error'
      }
    },
    {
      files: [
        '*.html'
      ],
      rules: {}
    }
  ]
}
