const { messages, ruleName, rule } = require('../index');

testRule({
    rule: rule,
    ruleName: ruleName,
    config: [true, {acceptedNumbers: [1,2,3], acceptedValues: ['100%', '25%']}],
    accept: [
        {
            code: '.foo { width: $myVar; }'
        },
        {
            code: '.foo { width: 1px; }'
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
            code: '.foo { margin: calc(100% - 3rem); }'
        }

    ],
    reject: [
        {
            code: '.foo { width: 75%; }',
            message: messages.expected('"width: 75%" -> 75% failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { width: 100px; }',
            message: messages.expected('"width: 100px" -> 100px failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { margin: 0 10px 0 15px; }',
            message: messages.expected('"margin: 0 10px 0 15px" -> 10px,15px failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { margin: calc(100% - 4rem); }',
            message: messages.expected('"margin: calc(100% - 4rem)" -> 4rem failed'),
            line: 1,
            column: 8
        }
    ]
});
