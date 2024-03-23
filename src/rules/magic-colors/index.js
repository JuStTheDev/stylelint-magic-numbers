"use strict";

const { utils } = require("stylelint");
const isVariable = require("stylelint/lib/utils/isVariable.cjs");

const ruleName = "magic-numbers/magic-colors";

const messages = utils.ruleMessages(ruleName, {
    expected: hint => `No-Magic-Colors ${hint}`
});

const meta = {
    url: "https://github.com/JuStTheDev/stylelint-magic-numbers"
};

function rule(actual, config) {
    return (root, result) => {
        const validOptions = utils.validateOptions(result, ruleName, { actual, config });
        if (!validOptions || !actual) {
            return;
        }

        root.walkDecls(decl => {
            const value = decl.value;
            const prop = decl.prop;

            // ignore variables
            if (isVariable(value) || value.startsWith("$") || prop.startsWith("$")) {
                return;
            }

            // ignore values that are no colors
            const isColor = RegExp(/rgba?\( *\d+, *\d+, *\d+(, *0?\.?\d+)? *\)|hsla?\( *\d+, *\d+%, *\d+%(, *0?\.?\d+)? *\)|#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{3}/, 'ig');
            if (!isColor.test(value)) {
                return;
            }

            // Ignore if Color is inside a String.
            const isStringWrapped = RegExp(/^(.*\()?['"].*['"]\)?$/g);
            if (isStringWrapped.test(value)) {
                return;
            }

            utils.report({
                index: decl.lastEach,
                message: messages.expected(`"${prop}: ${value}"`),
                node: decl,
                ruleName,
                result
            });
        });
    };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
