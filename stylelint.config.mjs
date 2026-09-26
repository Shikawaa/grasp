const config = {
  plugins: ["./scripts/stylelint-design-tokens.mjs"],
  rules: {
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "grasp/design-tokens": true,
  },
};

export default config;
