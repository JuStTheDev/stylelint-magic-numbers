'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rule = exports.messages = exports.ruleName = undefined;

var _stylelint = require('stylelint');

var _isVariable = require('stylelint/lib/utils/isVariable');

var _isVariable2 = _interopRequireDefault(_isVariable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ruleName = exports.ruleName = 'plugin-magic-numbers/plugin-magic-numbers';
// import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule';
var messages = exports.messages = _stylelint.utils.ruleMessages(ruleName, {
    expected: function expected(hint) {
        return 'No-Magic-Numbers ' + hint;
    }
});

var rule = exports.rule = function rule(actual, config) {
    return function (root, result) {
        var validOptions = _stylelint.utils.validateOptions(result, ruleName, { actual: actual, config: config });
        if (!validOptions || !actual) {
            return;
        }
        var acceptedValues = config.acceptedValues || [];
        var acceptedNumbers = config.acceptedNumbers || [];

        root.walkDecls(function (decl) {
            var value = decl.value;
            var prop = decl.prop;

            // ignore variables
            if ((0, _isVariable2.default)(value) || value.startsWith("$") || prop.startsWith("$")) {
                return;
            }

            // ignore values that are no numbers
            if (!/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)|\.\d+/.test(value)) {
                return;
            }

            var valueRegExp = RegExp(/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/, 'g');
            var values = [];
            value.match(valueRegExp).forEach(function (currentValue) {
                if (currentValue) {
                    values.push(currentValue);
                }
            });

            var accepted = true;
            var failedValues = [];
            values.forEach(function (val) {
                var theNumber = val.match(/([\d.]+)/)[0];
                var valOK = acceptedValues.includes(val) || acceptedNumbers.includes(parseFloat(theNumber));
                accepted = accepted && valOK;
                if (!valOK) {
                    failedValues.push(val);
                }
            });
            if (accepted) {
                return;
            }

            _stylelint.utils.report({
                index: decl.lastEach,
                message: messages.expected('"' + prop + ': ' + value + '" -> ' + failedValues + ' failed'),
                node: decl,
                result: result
            });
        });
    };
};

var rulesPlugins = (0, _stylelint.createPlugin)(ruleName, rule);

exports.default = rulesPlugins;