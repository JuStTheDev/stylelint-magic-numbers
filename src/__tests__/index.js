const { numbersMessages, numbersRuleName, numbersRule } = require('../index');
const { colorsMessages, colorsRuleName, colorsRule } = require('../index');

testRule({
    rule: numbersRule,
    ruleName: numbersRuleName,
    config: [true, {acceptedNumbers: [0,1,2,3], acceptedValues: ['100%', '25%']}],
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
        },
        {
            code: '.foo { transition: all 1s ease; }'
        },
        {
            code: '.foo { transform: scale(2); }'
        },
        {
            code: '.foo { transform: scale(2); }'
        },
        {
            code: '.foo { background-image: url(\'data:image/svg+xml;base64,PHN2Z2LjIwNiAwIDM2LjIwNGwtMjk0LjQgLTM2LjIwNC0uMDAxeiI+PC9wYXRoPjwvc3ZnPg==\'); }'
        }

    ],
    reject: [
        {
            code: '.foo { width: 75%; }',
            message: numbersMessages.expected('"width: 75%" -> 75% failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { width: 100px; }',
            message: numbersMessages.expected('"width: 100px" -> 100px failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { margin: 0 10px 0 15px; }',
            message: numbersMessages.expected('"margin: 0 10px 0 15px" -> 10px,15px failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { margin: calc(100% - 4rem); }',
            message: numbersMessages.expected('"margin: calc(100% - 4rem)" -> 4rem failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { line-height: 44; }',
            message: numbersMessages.expected('"line-height: 44" -> 44 failed'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { transform: scale(1.1); }',
            message: numbersMessages.expected('"transform: scale(1.1)" -> 1.1 failed'),
            line: 1,
            column: 8
        }
    ]
});

testRule({
    rule: colorsRule(),
    ruleName: colorsRuleName,
    config: [true],
    accept: [
        {
            code: '.foo { color: $myColor; }'
        },
        {
            code: '$myColor: #FFAABB;'
        },
        {
            code: '$myColor2: rgb(1,2,3);'
        },
        {
            code: '.foo { color: black; }'
        },
        {
            code: '.foo { color: $rgbVar; }'
        },
        {
            code: '$myVar: 100%;'
        },
        {
            code: '.foo { margin: calc(100% - 3rem); }'
        },
        {
            code: '.foo { content: \'#ABC\'; }'
        },
        {
            code: '.foo { content: "#ABC"; }'
        }

    ],
    reject: [
        {
            code: '.foo { color: rgb(2,3, 4); }',
            message: colorsMessages.expected('"color: rgb(2,3, 4)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: rgba(2,3, 4, 0.5); }',
            message: colorsMessages.expected('"color: rgba(2,3, 4, 0.5)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: RGBA(2,3, 4, .5); }',
            message: colorsMessages.expected('"color: RGBA(2,3, 4, .5)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: hsl(2,3%, 4%); }',
            message: colorsMessages.expected('"color: hsl(2,3%, 4%)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: hsla(2,3%, 4%); }',
            message: colorsMessages.expected('"color: hsla(2,3%, 4%)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: HSLA(2,3%, 4%, 0.5); }',
            message: colorsMessages.expected('"color: HSLA(2,3%, 4%, 0.5)"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: #000; }',
            message: colorsMessages.expected('"color: #000"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: #ABC; }',
            message: colorsMessages.expected('"color: #ABC"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: #FbFE7b; }',
            message: colorsMessages.expected('"color: #FbFE7b"'),
            line: 1,
            column: 8
        },
        {
            code: '.foo { color: #FbFE7bAA; }',
            message: colorsMessages.expected('"color: #FbFE7bAA"'),
            line: 1,
            column: 8
        },
    ]
});
