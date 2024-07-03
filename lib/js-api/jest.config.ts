/* eslint-disable */
export default {
    displayName: 'js-api',
    preset: '../../jest.preset.js',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/lib/js-api',
    testEnvironment: 'jsdom'
};
