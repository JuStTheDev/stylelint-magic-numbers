
module.exports = {
    extends: ['eslint:recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6
    },
    env: {
        es6: true,
        jest: true,
        node: true
    },
    plugins: ['import'],
    globals: {
        testRule: true
    }
};
