/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  // Output as a .cjs file:
  serverBuildPath: "build/index.cjs",
  serverModuleFormat: "cjs",
  serverPlatform: "node",
};