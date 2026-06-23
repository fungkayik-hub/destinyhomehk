import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const articlesPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/data/articles.json",
);
let text = await readFile(articlesPath, "utf-8");
const before = text;

text = text.replace(/(\/images\/site\/[^"\\]+)"(?=\s|>|\n)/g, '$1\\"');

await writeFile(articlesPath, text);
console.log(before === text ? "No changes" : "Fixed article img quotes");
