"use strict";

const rules = require("../index");

const ruleEntries = Object.entries(rules);

describe("rules", () => {
    it("rules exist", () => {
        expect(ruleEntries.length).toBeGreaterThan(0);
    });

    it('rules has "magic-numbers"', () => {
        expect(ruleEntries).toContainEqual(expect.arrayContaining(["magic-numbers", expect.any(Function)]));
    });

    it('rules has "magic-colors"', () => {
        expect(ruleEntries).toContainEqual(expect.arrayContaining(["magic-colors", expect.any(Function)]));
    });

    it('all rules are functions', () => {
        for (const [_, rule] of ruleEntries) {
            expect(rule).toBeInstanceOf(Function);
        }
    });

    it('all rules have the "ruleName" property', () => {
       for (const [ruleName, rule] of ruleEntries) {
           expect(rule).toHaveProperty("ruleName", expect.stringMatching(ruleName));
       }
    });

    it('all rules have the "messages" property', () => {
        for (const [_, rule] of ruleEntries) {
            expect(rule).toHaveProperty("messages", expect.any(Object));
        }
    });

    it('all rules have the "meta" property', () => {
        for (const [ruleName, rule] of ruleEntries) {
            expect(rule).toHaveProperty("meta", expect.any(Object));
            expect(rule).toHaveProperty("meta.url", expect.stringMatching('JuStTheDev/stylelint-magic-numbers'));
        }
    });
});
