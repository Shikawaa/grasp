import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourceRoots = ["app", "components", "lib", "scripts", "styles"];
const rootFiles = ["next.config.mjs"];
const allowedTokenFile = "styles/tokens.css";
const allowedTokenNamesFile = "styles/token-names.txt";
const checkedExtensions = new Set([".css", ".js", ".mjs", ".cjs", ".ts", ".tsx"]);
const hexColorPattern = /#[0-9a-fA-F]{3,8}\b/g;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (checkedExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

const nestedFiles = (
  await Promise.all(sourceRoots.map((directory) => collectFiles(join(projectRoot, directory))))
).flat();
const files = [...nestedFiles, ...rootFiles.map((file) => join(projectRoot, file))];
const violations = [];

for (const file of files) {
  const projectPath = relative(projectRoot, file);
  if (projectPath === allowedTokenFile) continue;

  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(hexColorPattern)) {
    const line = content.slice(0, match.index).split("\n").length;
    violations.push(`${projectPath}:${line} ${match[0]}`);
  }
}

if (violations.length > 0) {
  console.error("Couleurs hexadécimales trouvées hors de styles/tokens.css :");
  console.error(violations.join("\n"));
  process.exit(1);
}

const tokenSource = await readFile(join(projectRoot, allowedTokenFile), "utf8");
const allowedTokenNames = new Set(
  (await readFile(join(projectRoot, allowedTokenNamesFile), "utf8"))
    .split("\n")
    .filter(Boolean),
);
const currentTokenNames = new Set(
  Array.from(tokenSource.matchAll(/--[a-z0-9-]+/g), (match) => match[0]),
);
const unapprovedTokens = [...currentTokenNames].filter(
  (token) => !allowedTokenNames.has(token),
);

if (unapprovedTokens.length > 0) {
  console.error("Tokens ajoutés sans validation :");
  console.error(unapprovedTokens.sort().join("\n"));
  process.exit(1);
}

console.log("Design tokens : aucune couleur brute ni aucun nouveau token non validé.");
