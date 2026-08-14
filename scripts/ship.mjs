#!/usr/bin/env node
/**
 * One command to put a new build on TestFlight.
 *
 *   npm run ship                 bump the build number, commit it, build, submit
 *   npm run ship -- --no-submit  build only, don't send it to App Store Connect
 *
 * The bump is the point of this script. `eas.json` keeps `appVersionSource` on
 * "local", so the iOS build number lives in app.json — and App Store Connect
 * rejects an upload whose build number has been used before. Forgetting the
 * bump costs a full build cycle before anything tells you.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appJsonPath = resolve(projectDir, "app.json");
const submit = !process.argv.includes("--no-submit");

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: projectDir, encoding: "utf8", ...opts });

const step = (msg) => console.log(`\n› ${msg}`);

// 1. A dirty tree would ship something other than what you think. EAS uploads
//    committed state, so uncommitted edits are silently left out of the build.
const dirty = run("git", ["status", "--porcelain"])
  .trim()
  .split("\n")
  .filter(Boolean)
  .filter((line) => !line.endsWith(".DS_Store"));

if (dirty.length > 0) {
  console.error("\nUncommitted changes — EAS builds from committed state, so these would NOT be in the build:\n");
  console.error(dirty.map((l) => `  ${l}`).join("\n"));
  console.error("\nCommit or stash them, then run again.\n");
  process.exit(1);
}

// 2. Bump.
const app = JSON.parse(readFileSync(appJsonPath, "utf8"));
const previous = app.expo.ios.buildNumber;
const next = String(Number(previous) + 1);

if (!Number.isFinite(Number(previous))) {
  console.error(`\nios.buildNumber is "${previous}", which is not a number. Fix it in app.json first.\n`);
  process.exit(1);
}

app.expo.ios.buildNumber = next;
if (app.expo.android?.versionCode !== undefined) {
  app.expo.android.versionCode = Number(next);
}

writeFileSync(appJsonPath, `${JSON.stringify(app, null, 2)}\n`);
step(`Build number ${previous} → ${next}`);

// 3. Commit it, so the build is traceable to a commit and the number is not
//    lost if the build fails and you try again later.
run("git", ["add", "app.json"]);
run("git", ["commit", "-m", `Bump iOS build number to ${next}`]);
step("Committed the bump");

// 4. Build, and hand it straight to App Store Connect unless told not to.
const args = ["eas-cli@latest", "build", "--platform", "ios", "--profile", "production"];
if (submit) args.push("--auto-submit");

step(submit ? "Building and submitting to TestFlight" : "Building (not submitting)");
console.log("");

try {
  run("npx", ["--yes", ...args], { stdio: "inherit" });
} catch {
  console.error(
    `\nBuild failed. The bump to ${next} is already committed — just fix the problem and run \`npm run ship\` again;` +
      ` it will move to ${Number(next) + 1}, which is fine. Build numbers only have to increase, not be contiguous.\n`,
  );
  process.exit(1);
}
