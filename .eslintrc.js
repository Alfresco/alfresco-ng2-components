path = require('path');
module.exports = {
  root: true,
  ignorePatterns: [
    'projects/**/*',
    '**/node_modules/**/*',
    'lib/cli/node_modules/**/*',
    '**/node_modules',
    '**/docker',
    '**/assets',
    '**/scripts',
    '**/docs'
  ],
  overrides: [
    {
      files: [
        '*.ts'
      ],
      parserOptions: {
        project: [
          path.join(__dirname, 'tsconfig.json'),
          path.join(__dirname, 'e2e/tsconfig.e2e.json')
        ],
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/ng-cli-compat--formatting-add-on',
        'plugin:@angular-eslint/template/process-inline-templates'
      ],
      plugins: [
        'eslint-plugin-unicorn',
        'eslint-plugin-rxjs',
        'ban',
        'license-header'
      ],
      rules: {
        'ban/ban': [
          'error',
          { name: 'eval', message: 'Calls to eval is not allowed.' },
          { name: 'fdescribe', message: 'Calls to fdescribe is not allowed' },
          { name: 'fit', message: 'Calls to fit is not allowed' },
          { name: 'xit', message: 'Calls to xit is not allowed' },
          { name: 'xdescribe', message: 'Calls to xdescribe is not allowed' },
          { name: ['test', 'only'], message: 'Calls to test.only is not allowed' },
          { name: ['describe', 'only'], message: 'Calls to describe.only is not allowed' }
        ],
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
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: [
              'classProperty',
              'objectLiteralProperty',
              'typeProperty',
              'classMethod',
              'objectLiteralMethod',
              'typeMethod',
              'accessor',
              'enumMember'
            ],
            format: null,
            modifiers: ['requiresQuotes']
          }
        ],
        '@typescript-eslint/member-ordering': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',

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
        'no-console': [
          'error',
          {
            allow: [
              'warn',
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupEnd',
              'table',
              'dirxml',
              'error',
              'groupCollapsed',
              'Console',
              'profile',
              'profileEnd',
              'timeStamp',
              'context'
            ]
          }
        ],
        'no-duplicate-imports': 'error',
        'no-multiple-empty-lines': 'error',
        'no-redeclare': 'error',
        'no-return-await': 'error',
        'rxjs/no-create': 'error',
        'rxjs/no-subject-unsubscribe': 'error',
        'rxjs/no-subject-value': 'error',
        'rxjs/no-unsafe-takeuntil': 'error',
        'unicorn/filename-case': 'error',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true
          }
        ],
        'license-header/header': ['error',
            [
                '/*!',
                ' * @license',
                ' * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.',
                ' *',
                ' * Licensed under the Apache License, Version 2.0 (the \"License\");',
                ' * you may not use this file except in compliance with the License.',
                ' * You may obtain a copy of the License at',
                ' *',
                ' *     http://www.apache.org/licenses/LICENSE-2.0',
                ' *',
                ' * Unless required by applicable law or agreed to in writing, software',
                ' * distributed under the License is distributed on an \"AS IS\" BASIS,',
                ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
                ' * See the License for the specific language governing permissions and',
                ' * limitations under the License.',
                ' */'
            ]
        ]
      }
    },
    {
      files: [
        '*.html'
      ],
      extends: [
        'plugin:@angular-eslint/template/recommended'
      ],
      rules: {}
    }
  ]
}
