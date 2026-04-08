import typescript from "@rollup/plugin-typescript";
import nodeExternals from "rollup-plugin-node-externals";
// import terser from "@rollup/plugin-terser";

export default {
  input: "src/ipk.ts",
  output: {
    dir: "dist",
    format: "es",
    banner: "#!/usr/bin/env node",
  },
  plugins: [
    typescript(),
    nodeExternals(),
    // terser({ compress: false, mangle: false, format: { beautify: true } }),
  ],
  external: ["node"],
};
