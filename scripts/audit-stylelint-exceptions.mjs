import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import postcss from "postcss";

const projectRoot = resolve(import.meta.dirname, "..");
const colorPattern = /#[\da-f]{3,8}\b|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const dimensionPattern = /-?(?:\d+\.?\d*|\.\d+)(?:px|r?em|ch|ex|cap|ic|lh|rlh|v[wh]|vmin|vmax|s(?:v[wh]|)|l(?:v[wh]|)|d(?:v[wh]|)|cm|mm|q|in|pt|pc|deg|rad|grad|turn|ms)\b/i;

async function cssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await cssFiles(path)));
    else if (extname(entry.name) === ".css") files.push(path);
  }
  return files;
}

const files = [
  ...(await cssFiles(join(projectRoot, "app"))),
  ...(await cssFiles(join(projectRoot, "styles"))),
].sort();
const baseline = {};

for (const file of files) {
  const path = relative(projectRoot, file);
  if (path === "styles/tokens.css") continue;

  const root = postcss.parse(await readFile(file, "utf8"), { from: file });
  const counts = {};
  const add = (signature) => {
    counts[signature] = (counts[signature] ?? 0) + 1;
  };

  root.walkDecls((declaration) => {
    if (!colorPattern.test(declaration.value) && !dimensionPattern.test(declaration.value)) return;
    add(`${declaration.prop}: ${declaration.value.trim().replace(/\s+/g, " ")}`);
  });
  root.walkAtRules("media", (atRule) => {
    if (dimensionPattern.test(atRule.params)) {
      add(`@media ${atRule.params.trim().replace(/\s+/g, " ")}`);
    }
  });

  if (Object.keys(counts).length > 0) baseline[path] = counts;
}

console.log(JSON.stringify(baseline, null, 2));
