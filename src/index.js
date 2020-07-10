import { createPlugin } from 'stylelint';
import { utils } from "stylelint";
import isVariable  from 'stylelint/lib/utils/isVariable';

export const ruleName = 'plugin-magic-numbers/plugin-magic-numbers';
export const messages = utils.ruleMessages(
    ruleName,
    {
        expected: hint => `No-Magic-Numbers ${hint}`
    }
);

export const rule = (actual, config) => {
    return (root, result) => {
        const validOptions = utils.validateOptions(result, ruleName, {actual, config});
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
            if (
                !/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)|\.\d+/.test(
                    value
                )
            ) {
                return;
            }

            const valueRegExp = RegExp(/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, 'g');
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

            utils.report({
                index: decl.lastEach,
                message: messages.expected(`"${prop}: ${value}" -> ${failedValues} failed`),
                node: decl,
                result
            });
        });
    };
};

const rulesPlugins = createPlugin(ruleName, rule);

export default rulesPlugins;
