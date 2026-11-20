// Entry program for the gta6-meme-x-01 bounty.
//
// The whole job is deliberately tiny: the grader points MAKEFUN_BOT_DIR at
// this repository and MAKEFUN_OUTPUT_DIR at a scratch folder, and expects
// POST.json (the address of our X post) to land in the output folder,
// byte for byte, with nothing printed when everything goes well.
//
// Only node:fs and node:path are used — no network, no clock, no state —
// so two runs over the same repository always produce the same bytes.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

try {
  // The output folder may not exist yet on a fresh grading run.
  mkdirSync(outputDir, { recursive: true });
  const destination = join(outputDir, "POST.json");
  copyFileSync(join(sourceDir, "POST.json"), destination);
  // Trust, but verify: a copy that landed truncated or garbled would fail
  // the house's gate anyway, so read the destination back and make sure it
  // still parses as JSON before calling the run a success.
  JSON.parse(readFileSync(destination, "utf8"));
} catch (err) {
  // Any failure (missing POST.json, unwritable output, ...) is reported on
  // stderr and turned into a non-zero exit so the grader sees it clearly.
  const message = err instanceof Error ? err.message : String(err);
  console.error(`main.ts: could not copy POST.json: ${message}`);
  process.exit(1);
}
