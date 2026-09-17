import { build, context } from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(".");
const output = resolve(root, "main.js");
const livePlugin = resolve(
  root,
  ".obsidian",
  "plugins",
  "command-center",
  "main.js"
);

const buildOptions = {
  entryPoints: [resolve(root, "src", "main.ts")],
  bundle: true,
  outfile: output,
  external: ["obsidian"],
  format: "cjs",
  target: "es2020",
};

function syncToObsidian() {
  mkdirSync(dirname(livePlugin), { recursive: true });
  copyFileSync(output, livePlugin);
  console.log(`Synced ${output} → ${livePlugin}`);
}

try {
  await build(buildOptions);
  syncToObsidian();

  const ctx = await context({
    ...buildOptions,
    plugins: [
      {
        name: "sync-to-obsidian",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              try {
                syncToObsidian();
              } catch (error) {
                console.error("Failed to sync to Obsidian:", error);
              }
            }
          });
        },
      },
    ],
  });

  await ctx.watch();

  console.log("Command Center development build is watching for changes.");
  console.log("Reload the plugin in Obsidian after a successful sync.");
} catch (error) {
  console.error("Development build failed:", error);
  process.exit(1);
}