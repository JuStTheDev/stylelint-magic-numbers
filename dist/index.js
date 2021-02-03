"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.colorsRule = exports.numbersRule = exports.colorsMessages = exports.numbersMessages = exports.colorsRuleName = exports.numbersRuleName = void 0;

var _stylelint = require("stylelint");

var _isVariable = _interopRequireDefault(require("stylelint/lib/utils/isVariable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var numbersRuleName = 'magic-numbers/magic-numbers';
exports.numbersRuleName = numbersRuleName;
var colorsRuleName = 'magic-numbers/magic-colors';
exports.colorsRuleName = colorsRuleName;

var numbersMessages = _stylelint.utils.ruleMessages(numbersRuleName, {
  expected: function expected(hint) {
    return "No-Magic-Numbers ".concat(hint);
  }
});

exports.numbersMessages = numbersMessages;

var colorsMessages = _stylelint.utils.ruleMessages(colorsRuleName, {
  expected: function expected(hint) {
    return "No-Magic-Colors ".concat(hint);
  }
});

exports.colorsMessages = colorsMessages;

var numbersRule = function numbersRule(actual, config) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, numbersRuleName, {
      actual: actual,
      config: config
    });

    if (!validOptions || !actual) {
      return;
    }

    var acceptedValues = config.acceptedValues || [];
    var acceptedNumbers = config.acceptedNumbers || [];
    root.walkDecls(function (decl) {
      var value = decl.value;
      var prop = decl.prop; // ignore variables

      if ((0, _isVariable["default"])(value) || value.startsWith("$") || prop.startsWith("$")) {
        return;
      } // ignore values that are no numbers


      var valueRegExp = RegExp(/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|ms|s|fr)?|\.\d+/, 'g');

      if (!valueRegExp.test(value)) {
        return;
      }

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
      } // Ignore if Value is inside a String.


      var isStringWrapped = RegExp(/^(.*\()?['"].*['"]\)?$/g);

      if (isStringWrapped.test(value)) {
        return;
      }

      _stylelint.utils.report({
        index: decl.lastEach,
        message: numbersMessages.expected("\"".concat(prop, ": ").concat(value, "\" -> ").concat(failedValues, " failed")),
        node: decl,
        ruleName: numbersRuleName,
        result: result
      });
    });
  };
};

exports.numbersRule = numbersRule;

var colorsRule = function colorsRule(actual) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, numbersRuleName, {
      actual: actual
    });

    if (!validOptions || !actual) {
      return;
    }

    root.walkDecls(function (decl) {
      var value = decl.value;
      var prop = decl.prop; // ignore variables

      if ((0, _isVariable["default"])(value) || value.startsWith("$") || prop.startsWith("$")) {
        return;
      } // ignore values that are no colors


      var isColor = RegExp(/rgba?\( *\d+, *\d+, *\d+(, *0?\.?\d+)? *\)|hsla?\( *\d+, *\d+%, *\d+%(, *0?\.?\d+)? *\)|#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{3}/, 'ig');

      if (!isColor.test(value)) {
        return;
      } // Ignore if Color is inside a String.


      var isStringWrapped = RegExp(/^['"].*['"]$/);

      if (isStringWrapped.test(value)) {
        return;
      }

      _stylelint.utils.report({
        index: decl.lastEach,
        message: colorsMessages.expected("\"".concat(prop, ": ").concat(value, "\"")),
        node: decl,
        ruleName: colorsRuleName,
        result: result
      });
    });
  };
};

exports.colorsRule = colorsRule;
var rulesPlugins = [(0, _stylelint.createPlugin)(numbersRuleName, numbersRule), (0, _stylelint.createPlugin)(colorsRuleName, colorsRule)];
var _default = rulesPlugins;
exports["default"] = _default;