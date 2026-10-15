import { readFileSync } from "node:fs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH === "true";
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

// The release artifact is this single file, so it carries its own license notice.
const banner = `/*! ${pkg.name} v${pkg.version} | Copyright (c) 2026 Locale Systems | MIT License | ${pkg.homepage} */`;

export default {
  input: "src/ceiling-fan-card.ts",
  output: {
    file: "dist/ceiling-fan-card.js",
    format: "es",
    inlineDynamicImports: true,
    banner,
  },
  plugins: [
    resolve(),
    json({ preferConst: true }),
    typescript({ tsconfig: "./tsconfig.json" }),
    // "some" keeps /*! … */ and @license comments: our banner and the
    // BSD-3-Clause notices of the bundled Lit packages.
    !dev && terser({ format: { comments: "some" } }),
  ],
};
