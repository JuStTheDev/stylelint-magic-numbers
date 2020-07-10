'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.colorsRule = exports.numbersRule = exports.colorsMessages = exports.numbersMessages = exports.colorsRuleName = exports.numbersRuleName = undefined;

var _stylelint = require('stylelint');

var _isVariable = require('stylelint/lib/utils/isVariable');

var _isVariable2 = _interopRequireDefault(_isVariable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numbersRuleName = exports.numbersRuleName = 'plugin-magic-numbers/rule-magic-numbers';
var colorsRuleName = exports.colorsRuleName = 'plugin-magic-numbers/rule-magic-colors';
var numbersMessages = exports.numbersMessages = _stylelint.utils.ruleMessages(numbersRuleName, {
    expected: function expected(hint) {
        return 'No-Magic-Numbers ' + hint;
    }
});

var colorsMessages = exports.colorsMessages = _stylelint.utils.ruleMessages(colorsRuleName, {
    expected: function expected(hint) {
        return 'No-Magic-Colors ' + hint;
    }
});

var numbersRule = exports.numbersRule = function numbersRule(actual, config) {
    return function (root, result) {
        var validOptions = _stylelint.utils.validateOptions(result, numbersRuleName, { actual: actual, config: config });
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
                message: numbersMessages.expected('"' + prop + ': ' + value + '" -> ' + failedValues + ' failed'),
                node: decl,
                ruleName: numbersRuleName,
                result: result
            });
        });
    };
};

var colorsRule = exports.colorsRule = function colorsRule(actual) {
    return function (root, result) {
        var validOptions = _stylelint.utils.validateOptions(result, numbersRuleName, { actual: actual });
        if (!validOptions || !actual) {
            return;
        }

        root.walkDecls(function (decl) {
            var value = decl.value;
            var prop = decl.prop;

            // ignore variables
            if ((0, _isVariable2.default)(value) || value.startsWith("$") || prop.startsWith("$")) {
                return;
            }

            // ignore values that are no colors
            var isColor = RegExp(/rgba?\( *\d+, *\d+, *\d+(, *0?\.?\d+)? *\)|hsla?\( *\d+, *\d+%, *\d+%(, *0?\.?\d+)? *\)|#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{3}/, 'ig');
            if (!isColor.test(value)) {
                return;
            }

            // Ignore if Color is inside a String.
            var isStringWrapped = RegExp(/^['"].*['"]$/);
            if (isStringWrapped.test(value)) {
                return;
            }

            _stylelint.utils.report({
                index: decl.lastEach,
                message: colorsMessages.expected('"' + prop + ': ' + value + '"'),
                node: decl,
                ruleName: colorsRuleName,
                result: result
            });
        });
    };
};

var rulesPlugins = [(0, _stylelint.createPlugin)(numbersRuleName, numbersRule), (0, _stylelint.createPlugin)(colorsRuleName, colorsRule)];

exports.default = rulesPlugins;