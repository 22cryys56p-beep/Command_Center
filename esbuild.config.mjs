import esbuild from "esbuild";

// Build entry point (src/main.ts) does not exist yet — it is introduced in a
// later work package (WP12, orientation element / plugin bootstrap) per the
// WP10 development sequence. This config is committed now as part of the
// repository foundation; running `npm run build` before src/main.ts exists
// will fail intentionally rather than silently produce an empty bundle.

esbuild
  .build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: ["obsidian"],
    format: "cjs",
    target: "es2020",
    outfile: "main.js",
  })
  .catch(() => process.exit(1));
