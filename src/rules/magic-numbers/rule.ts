'use strict';

import stylelint, { Rule } from 'stylelint';

const { validateOptions, report } = stylelint.utils;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { declarationValueIndex } from 'stylelint/lib/utils/nodeFieldIndices.cjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import isVariable from 'stylelint/lib/utils/isVariable.cjs';
import { messages, meta } from './meta';

const ruleName = 'magic-numbers/magic-numbers';

interface SecondaryOptions {
  acceptedNumbers?: number[];
  acceptedValues?: string[];
}

export const magicNumbers: Rule = (
  primaryOption: boolean,
  secondaryOptions: SecondaryOptions = {},
) => {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        actual: secondaryOptions,
        optional: true,
        possible: {
          acceptedNumbers: [(value: unknown) => typeof value === 'number'],
          acceptedValues: [(value: unknown) => typeof value === 'string'],
        },
      },
    );

    if (!validOptions || !primaryOption) {
      return;
    }

    const { acceptedValues = [], acceptedNumbers = [] } = secondaryOptions;

    root.walkDecls((decl) => {
      const value = decl.value;
      const prop = decl.prop;

      // ignore variables
      if (isVariable(value) || value.startsWith('$') || prop.startsWith('$')) {
        return;
      }

      // ignore values that are no numbers
      const valueRegExp = RegExp(
        /\d+\.?\d*(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|ms|s|fr)?|\.\d+/,
        'g',
      );
      if (!valueRegExp.test(value)) {
        return;
      }

      const values: string[] = [];
      // @ts-expect-error null value is handled correctly by the forEach loop, so we can ignore the TypeScript error here.
      value.match(valueRegExp).forEach((currentValue) => {
        if (currentValue) {
          values.push(currentValue);
        }
      });

      let accepted = true;
      const failedValues: string[] = [];
      values.forEach((val) => {
        // @ts-expect-error null value is handled correctly so we can ignore the TypeScript error here.
        const theNumber = val.match(/([\d.]+)/)[0];
        const valOK =
          acceptedValues.includes(val) || acceptedNumbers.includes(parseFloat(theNumber));
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
        endIndex: declarationValueIndex(decl) + value.length,
        index: declarationValueIndex(decl),
        message: messages.expected(`"${prop}: ${value}" -> ${failedValues} failed`),
        node: decl,
        result,
        ruleName,
      });
    });
  };
};

magicNumbers.ruleName = ruleName;
magicNumbers.messages = messages;
magicNumbers.meta = meta;
