// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        'src/ts/**/*.ts',
    ],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'tests/coverage',

    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/ts/@types'
    ],

    // An array of file extensions your modules use
    moduleFileExtensions: [
        'ts',
        'js'
    ],

    // The test environment that will be used for testing
    testEnvironment: 'node',

    testMatch: [
        '**/tests/**/*.test.ts',
    ],

    globalTeardown: '<rootDir>/tests/teardown.ts',

    moduleNameMapper: {
        'electron-devtools-installer': '<rootDir>/tests/mocks/electron-devtools-installer.ts',
        'electron': '<rootDir>/tests/mocks/electron.ts',
    },
};
