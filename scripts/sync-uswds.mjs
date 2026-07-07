// Vendors the USWDS static assets (fonts, images, behavior JS) from
// node_modules into /public/uswds. The CSS itself is compiled separately by
// `npm run build:css` from styles/uswds so we can set Public Sans as the base
// font. Run `npm run sync:uswds` after upgrading @uswds/uswds. The vendored
// output is committed so the deploy build needs no extra step.
import { cpSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "@uswds", "uswds", "dist");
const dest = join(root, "public", "uswds");

if (!existsSync(src)) {
  console.error(`[sync-uswds] USWDS dist not found at ${src}. Run npm install first.`);
  process.exit(1);
}

// Refresh assets without touching the compiled css/ produced by build:css.
for (const dir of ["fonts", "img", "js"]) {
  rmSync(join(dest, dir), { recursive: true, force: true });
}
mkdirSync(join(dest, "js"), { recursive: true });

cpSync(join(src, "fonts"), join(dest, "fonts"), { recursive: true });
cpSync(join(src, "img"), join(dest, "img"), { recursive: true });
cpSync(join(src, "js", "uswds.min.js"), join(dest, "js", "uswds.min.js"));

console.log(`[sync-uswds] Vendored USWDS fonts/img/js → ${dest}`);
