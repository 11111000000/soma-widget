/** @type {import("snowpack").SnowpackUserConfig } */

export default {
  workspaceRoot: '../',
  mount: {
    './src': '/',
  },
  plugins: ['@snowpack/plugin-typescript'],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: 'es2017',
  },
  packageOptions: {
    // source: 'remote',
    // origin: 'https://cdn.skypack.dev',
    types: true,
    knownEntrypoints: ['dex-api'],
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {
    sourcemap: true,
  },
}
