import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import stylelint from "stylelint";

const ruleName = "grasp/design-tokens";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (signature) => `Valeur visuelle brute non autorisée : ${signature}`,
});
const projectRoot = resolve(import.meta.dirname, "..");
const exceptions = JSON.parse(
  readFileSync(resolve(projectRoot, "stylelint-token-exceptions.json"), "utf8"),
);
const colorPattern = /#[\da-f]{3,8}\b|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const dimensionPattern = /-?(?:\d+\.?\d*|\.\d+)(?:px|r?em|ch|ex|cap|ic|lh|rlh|v[wh]|vmin|vmax|s(?:v[wh]|)|l(?:v[wh]|)|d(?:v[wh]|)|cm|mm|q|in|pt|pc|deg|rad|grad|turn|ms)\b/i;

function normalize(value) {
  return value.trim().replace(/\s+/g, " ");
}

function projectPath(root) {
  const file = root.source?.input.file;
  return file ? relative(projectRoot, file).split(sep).join("/") : "";
}

function isRawDesignValue(value) {
  return colorPattern.test(value) || dimensionPattern.test(value);
}

const rule = (primary) => (root, result) => {
  if (!primary) return;

  const file = projectPath(root);
  if (!file || file === "styles/tokens.css") return;

  const allowed = exceptions[file] ?? {};
  const seen = new Map();

  function check(node, signature) {
    const occurrence = (seen.get(signature) ?? 0) + 1;
    seen.set(signature, occurrence);
    if (occurrence <= (allowed[signature] ?? 0)) return;

    stylelint.utils.report({
      message: messages.rejected(signature),
      node,
      result,
      ruleName,
    });
  }

  root.walkDecls((declaration) => {
    if (!isRawDesignValue(declaration.value)) return;
    check(declaration, `${declaration.prop}: ${normalize(declaration.value)}`);
  });

  root.walkAtRules("media", (atRule) => {
    if (!dimensionPattern.test(atRule.params)) return;
    check(atRule, `@media ${normalize(atRule.params)}`);
  });
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
