const { utils } = require("stylelint");
const isVariable = require("stylelint/lib/utils/isVariable");
const isAfterComment = require("stylelint/lib/utils/isAfterComment");
const { namespace } = require("../../utils");

const ruleName = namespace("no-magic-numbers");
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Magic numbers are forbidden"
});

module.exports = stylelint.createPlugin(ruleName, function (
  primaryOption,
  secondaryOptionObject
) {
return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const value = decl.value;

      // ignore variables
      if (isVariable(value) || value.startsWith("$")) {
        return;
      }

      // ignore value that not number
      if (
        !/\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)|\.\d+/.test(
          value
        )
      ) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName
      });
    });
  };
});

module.exports.ruleName = ruleName
module.exports.messagess = messages;
