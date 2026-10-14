// scripts/patch-kysely.mjs
// Adds missing constants to kysely that @better-auth/kysely-adapter expects.
// Run automatically via postinstall.
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const kyselyIndexPath = join(
  __dirname,
  "..",
  "node_modules",
  "kysely",
  "dist",
  "index.js"
);

const PATCH_MARKER = "// @better-auth/kysely-adapter polyfill";
const PATCH = `
${PATCH_MARKER}
export const DEFAULT_MIGRATION_TABLE = 'kysely_migration';
export const DEFAULT_MIGRATION_LOCK_TABLE = 'kysely_migration_lock';
`;

try {
  const content = readFileSync(kyselyIndexPath, "utf8");
  if (!content.includes(PATCH_MARKER)) {
    writeFileSync(kyselyIndexPath, content + PATCH, "utf8");
    console.log("[postinstall] Patched kysely for @better-auth/kysely-adapter");
  } else {
    console.log("[postinstall] kysely already patched, skipping.");
  }
} catch (e) {
  console.warn("[postinstall] Could not patch kysely:", e.message);
}
