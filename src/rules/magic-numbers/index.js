"use strict";

const stylelint = require("stylelint");

const { utils: {ruleMessages, validateOptions, report} } = stylelint;
const {declarationValueIndex} = require("stylelint/lib/utils/nodeFieldIndices.cjs");
const isVariable = require("stylelint/lib/utils/isVariable.cjs");
const ruleName = "magic-numbers/magic-numbers";

const messages = ruleMessages(ruleName, {
    expected: hint => `No-Magic-Numbers ${hint}`
});

const meta = {
    url: "https://github.com/JuStTheDev/stylelint-magic-numbers"
};

function rule(actual, config) {
    return (root, result) => {
        const validOptions = validateOptions(result, ruleName, {actual, config});

        if (!validOptions) {
            return;
        }

        const acceptedValues = config?.acceptedValues || [];
        const acceptedNumbers = config?.acceptedNumbers || [];

        root.walkDecls(decl => {
            const value = decl.value;
            const prop = decl.prop;

            // ignore variables
            if (isVariable(value) || value.startsWith("$") || prop.startsWith("$")) {
                return;
            }

            // ignore values that are no numbers
            const valueRegExp = RegExp(/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|ms|s|fr)?|\.\d+/, 'g');
            if (!valueRegExp.test(value)) {
                return;
            }

            const values = [];
            value.match(valueRegExp).forEach((currentValue) => {
                if (currentValue) {
                    values.push(currentValue);
                }
            });

            let accepted = true;
            const failedValues = [];
            values.forEach(val => {
                const theNumber = val.match(/([\d.]+)/)[0];
                const valOK = acceptedValues.includes(val) || acceptedNumbers.includes(parseFloat(theNumber));
                accepted = accepted && valOK;
                if (!valOK) {
                    failedValues.push(val);
                }
            });
            if (accepted) {
                return;
            }

            // Ignore if Value is inside a String.
            const isStringWrapped = RegExp(/^(.*\()?['"].*['"]\)?$/g);
            if (isStringWrapped.test(value)) {
                return;
            }

            report({
                index: declarationValueIndex(decl),
                endIndex: declarationValueIndex(decl) + value.length,
                message: messages.expected(`"${prop}: ${value}" -> ${failedValues} failed`),
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
