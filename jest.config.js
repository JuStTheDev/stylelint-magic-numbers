module.exports = {
    preset: 'jest-preset-stylelint',
    clearMocks: true,
    setupFiles: ['./jest.setup.js'],
    testEnvironment: 'node',
    roots: ['./src'],
    testRegex: '.*/__tests__/.*.js$',
    coveragePathIgnorePatterns: ["/node_modules", "/src"]
};
