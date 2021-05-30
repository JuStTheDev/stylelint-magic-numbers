import {createPlugin, utils} from 'stylelint';
import isVariable from 'stylelint/lib/utils/isVariable';

export const numbersRuleName = 'magic-numbers/magic-numbers';
export const colorsRuleName = 'magic-numbers/magic-colors';
export const numbersMessages = utils.ruleMessages(
    numbersRuleName,
    {
        expected: hint => `No-Magic-Numbers ${hint}`
    }
);

export const colorsMessages = utils.ruleMessages(
    colorsRuleName,
    {
        expected: hint => `No-Magic-Colors ${hint}`
    }
);

export const numbersRule = (actual, config) => {
    return (root, result) => {
        const validOptions = utils.validateOptions(result, numbersRuleName, {actual, config});
        if (!validOptions || !actual) {
            return;
        }
        var acceptedValues = config.acceptedValues || [];
        var acceptedNumbers = config.acceptedNumbers || [];

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

            utils.report({
                index: decl.lastEach,
                message: numbersMessages.expected(`"${prop}: ${value}" -> ${failedValues} failed`),
                node: decl,
                ruleName: numbersRuleName,
                result
            });
        });
    };
};

export const colorsRule = (actual) => {
    return (root, result) => {
        const validOptions = utils.validateOptions(result, numbersRuleName, {actual});
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
                message: colorsMessages.expected(`"${prop}: ${value}"`),
                node: decl,
                ruleName: colorsRuleName,
                result
            });
        });
    };
};


const rulesPlugins = [
    createPlugin(numbersRuleName, numbersRule),
    createPlugin(colorsRuleName, colorsRule)
];

export default rulesPlugins;
