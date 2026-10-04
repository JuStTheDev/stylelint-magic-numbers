import stylelint, { RuleMeta } from 'stylelint';

const { ruleMessages } = stylelint.utils;

export const name = 'magic-numbers/magic-colors';

export const messages = ruleMessages(name, {
  rejected: (hint: string) => `Magic-Colors ${hint}`,
});

export const meta: RuleMeta = {
  deprecated: false,
  fixable: false,
  url: 'https://github.com/JuStTheDev/stylelint-magic-numbers',
};
