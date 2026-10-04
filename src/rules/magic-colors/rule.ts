'use strict';

import stylelint, { Rule } from 'stylelint';

const { validateOptions, report } = stylelint.utils;
// @ts-expect-error It works like this
import { declarationValueIndex } from 'stylelint/lib/utils/nodeFieldIndices.cjs';
// @ts-expect-error It works like this
import isVariable from 'stylelint/lib/utils/isVariable.cjs';
import { messages, meta } from './meta';
import { FixProps, severityOption, SeverityProps } from '../../utils/types';

const ruleName = 'magic-numbers/magic-colors';

interface SecondaryOptions extends SeverityProps, FixProps {
  ignore?: (string | RegExp)[];
}

export const magicColors: Rule = (
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
        possible: { ...severityOption },
      },
    );
    if (!validOptions || !primaryOption) {
      return;
    }

    root.walkDecls((decl) => {
      const value = decl.value;
      const prop = decl.prop;

      // ignore variables
      if (isVariable(value) || value.startsWith('$') || prop.startsWith('$')) {
        return;
      }

      // ignore values that are no colors
      const isColor = RegExp(
        /rgba?\( *\d+, *\d+, *\d+(, *0?\.?\d+)? *\)|hsla?\( *\d+, *\d+%, *\d+%(, *0?\.?\d+)? *\)|#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{3}/,
        'ig',
      );
      if (!isColor.test(value)) {
        return;
      }

      // Ignore if Color is inside a String.
      const isStringWrapped = RegExp(/^(.*\()?['"].*['"]\)?$/g);
      if (isStringWrapped.test(value)) {
        return;
      }
      report({
        endIndex: declarationValueIndex(decl) + value.length,
        index: declarationValueIndex(decl),
        message: messages.rejected(`"${prop}: ${value}"`),
        node: decl,
        result,
        ruleName,
      });
    });
  };
};

magicColors.ruleName = ruleName;
magicColors.messages = messages;
magicColors.meta = meta;
