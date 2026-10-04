import stylelint, { RuleMeta } from 'stylelint';

const { ruleMessages } = stylelint.utils;

export const name = 'magic-numbers/magic-numbers';

export const messages = ruleMessages(name, {
  expected: (hint: string) => `Magic-Numbers ${hint}`,
});

export const meta: RuleMeta = {
  deprecated: false,
  fixable: false,
  url: 'https://github.com/JuStTheDev/stylelint-magic-numbers',
};
