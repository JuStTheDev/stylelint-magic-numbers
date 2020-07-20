# stylelint-no-magic-numbers
Sylelint Plugin to Prevent Magic Numbers

A plugin pack of magic numbers linting rules for SCSS with [stylelint].

## Installation

1. If you haven't, install [stylelint]:

```
npm install stylelint stylelint-scss --save-dev
```
or
```
yarn add -D stylelint stylelint-scss
```

2.  Install `stylelint-order`:

```
npm install stylelint-no-magic-numbers --save-dev
```
or
```
yarn add -D stylelint-no-magic-numbers
```

## Usage and Example Config

Add `stylelint-no-magic-numbers` to your stylelint config `plugins` array, then add rules you need to the rules list.

```json
{
  "plugins": [
    "stylelint-scss",
    "stylelint-no-magic-numbers"
  ],
  "rules": {
    "plugin-magic-numbers/rule-magic-numbers": [
      true,
      {
        "acceptedValues": ["100%", "50%"],
        "acceptedNumbers": [0, 0.25, 0.5, 1, 1.5, 2],
        "severity": "error"
      }
    ],
    "plugin-magic-numbers/rule-magic-colors": [true],
    ...
}
```

## Rules and Configuration

### `rule-magic-numbers`
The magic numbers rule prohibits usages of magic numbers in SCSS code. Allowed exceptions can be supplied for value-unit combination and for unitless values. SCSS variables are considered as no violations.

Config:
```ts
[
  boolean,                                       // Enable/Disable
  {
    acceptedValues: string[],                    // Allowed values including their units
    acceptedNumbers: number[],                   // Allowed values with any unit
    severity: "error" | "warning" | "ignore"     // The severity of violations
  }
]
```

The following pattern are considered violations given the example config:

```scss
.foo {
  width: 87%;
  height: 3rem;
  border: 100px;
  padding: calc(100% - 30px);
}
```

The following patterns are _not_ considered violations given the example config:

```scss
.foo {
  width: 2rem;
  line-height: 1.5;
  height: 2px;
  padding: calc(100% - 2px);
}

$border-width: 30px;
```


### `rule-magic-colors`
The magic colors rule prohibits usages of magic colors in SCSS code. Colors in HEX, RGB, RGBA, HSL and HSLA format will be detected. SCSS variables are considered as no violations.

Config:
```ts
[
  boolean  // Enable/Disable
]
```

The following pattern are considered violations given the example config:

```scss
.foo {
  background: #F00;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid #FBFE7B;
}
```

The following patterns are _not_ considered violations:

```scss
$highlight-color: $FBFE7B;
$transparent-black: rgba(0, 0, 0, 0.5);
```

[stylelint]: https://stylelint.io/