import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  // Every component uses hooks or handlers; tsup drops per-file directives.
  banner: { js: '"use client";' },
});
