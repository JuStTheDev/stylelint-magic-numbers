'use strict';

const { ruleName, messages } = require('..');

describe('magic-colors', () => {
    testRule({
        ruleName,
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
            },
            {
                code: '.foo { background-image: url(\'data:image/svg+xml;base64,#ABCABCrgba(2,3,4)==\'); }'
            },
            {
                code: '.foo { background-image: url("data:image/svg+xml;base64,#ABCABCrgba(2,3,4)=="); }'
            }

        ],
        reject: [
            {
                code: '.foo { color: rgb(2, 3, 4); }',
                message: messages.expected('"color: rgb(2, 3, 4)"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { background-color: rgba(2, 3, 4, 0.5); }',
                message: messages.expected('"background-color: rgba(2, 3, 4, 0.5)"'),
                line: 1,
                column: 26
            },
            {
                code: '.foo { color: RGBA(2, 3, 4, .5); }',
                message: messages.expected('"color: RGBA(2, 3, 4, .5)"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: hsl(2, 3%, 4%); }',
                message: messages.expected('"color: hsl(2, 3%, 4%)"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: hsla(2, 3%, 4%); }',
                message: messages.expected('"color: hsla(2, 3%, 4%)"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: HSLA(2, 3%, 4%, 0.5); }',
                message: messages.expected('"color: HSLA(2, 3%, 4%, 0.5)"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: #000; }',
                message: messages.expected('"color: #000"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: #ABC; }',
                message: messages.expected('"color: #ABC"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: #FbFE7b; }',
                message: messages.expected('"color: #FbFE7b"'),
                line: 1,
                column: 15
            },
            {
                code: '.foo { color: #FbFE7bAA; }',
                message: messages.expected('"color: #FbFE7bAA"'),
                line: 1,
                column: 15
            },
        ]
    });
});


describe('magic-colors wrong config', () => {
    testRule({
        ruleName,
        config: [{ foo: "bar"}],
        reject: [
            {
                code: '.foo { color: $myColor; }',
                message: "Unexpected option value \"{\"foo\":\"bar\"}\" for rule \"magic-numbers/magic-colors\"",
            },
            {
                code: '.foo { color: #000; }',
                message: "Unexpected option value \"{\"foo\":\"bar\"}\" for rule \"magic-numbers/magic-colors\"",
            }
        ],
    });
});
