'use strict';

const {ruleName, messages} = require('..');

describe('magic-numbers', () => {
    testRule({
        ruleName,
        config: [true, {acceptedNumbers: [0, 1, 2, 3], acceptedValues: ['100%', '25%']}],
        accept: [
            {
                code: '.foo { color: green; }'
            },
            {
                code: '.foo { width: $myVar; }'
            },
            {
                code: '.foo { width: 1px; }'
            },
            {
                code: '.foo { grid-template-rows: max-content 1fr max-content; }'
            },
            {
                code: '.foo { width: 25%; }'
            },
            {
                code: '$myVar: 123px;'
            },
            {
                code: '$myVar: 3px;'
            },
            {
                code: '$myVar: 100%;'
            },
            {
                code: '$myVar: 1fr;'
            },
            {
                code: '.foo { margin: calc(100% - 3rem); }'
            },
            {
                code: '.foo { transition: all 1s ease; }'
            },
            {
                code: '.foo { transform: scale(2); }'
            },
            {
                code: '.foo { background-image: url(\'data:image/svg+xml;base64,PHN2Z2LjIwNiAwIDM2LjIwNGwtMjk0LjQgLTM2LjIwNC0uMDAxeiI+PC9wYXRoPjwvc35ZnPg==\'); }'
            },
            {
                code: '.foo { background-image: url("data:image/svg+xml;base64,PHN2Z2LjIwNiAwIDM2LjIwNGwtMjk0LjQgLTM2LjIwNC0uMDAxeiI+PC9wYXRoPjwvc35ZnPg=="); }'
            },
            {
                code: '.foo:after { content: "The answer is 42" }'
            },
            {
                code: '.foo:after { content: \'The answer is 42\' }'
            }

        ],
        reject: [
            {
                code: '.foo { width: 75%; }',
                message: messages.expected('"width: 75%" -> 75% failed'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { grid-template-rows: max-content 4fr max-content; }',
                message: messages.expected('"grid-template-rows: max-content 4fr max-content" -> 4fr failed'),
                line: 1,
                column: 28
            },
            {
                code: '.foo { width: 100px; }',
                message: messages.expected('"width: 100px" -> 100px failed'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { margin: 0 10px 0 15px; }',
                message: messages.expected('"margin: 0 10px 0 15px" -> 10px,15px failed'),
                line: 1,
                column: 16
            },
            {
                code: '.foo { margin: calc(100% - 4rem); }',
                message: messages.expected('"margin: calc(100% - 4rem)" -> 4rem failed'),
                line: 1,
                column: 16
            },
            {
                code: '.foo { line-height: 44; }',
                message: messages.expected('"line-height: 44" -> 44 failed'),
                line: 1,
                column: 21
            },
            {
                code: '.foo { transform: scale(1.1); }',
                message: messages.expected('"transform: scale(1.1)" -> 1.1 failed'),
                line: 1,
                column: 19
            }
        ]
    });
});

describe('magic-numbers minimum config', () => {
    testRule({
        ruleName,
        config: [true],
        accept: [
            {
                code: '.foo { color: green; }'
            },
            {
                code: '.foo { width: $myVar; }'
            }
        ],
        reject: [
            {
                code: '.foo { width: 1px; }',
                message: messages.expected('"width: 1px" -> 1px failed'),
                line: 1,
                column: 15
            },            {
                code: '.foo { grid-template-rows: max-content 1fr max-content; }',
                message: messages.expected('"grid-template-rows: max-content 1fr max-content" -> 1fr failed'),
                line: 1,
                column: 28
            }
        ]
    });
});


describe('magic-numbers wrong config', () => {
    testRule({
        ruleName,
        config: [{foo: "bar"}],
        reject: [
            {
                code: '.foo { color: $myColor; }',
                message: "Unexpected option value \"{\"foo\":\"bar\"}\" for rule \"magic-numbers/magic-numbers\"",
            },
            {
                code: '.foo { color: #000; }',
                message: "Unexpected option value \"{\"foo\":\"bar\"}\" for rule \"magic-numbers/magic-numbers\"",
            }
        ],
    });
});
