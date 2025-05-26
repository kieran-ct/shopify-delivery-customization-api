// remix.config.cjs
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  routes: async (defineRoutes) =>
    defineRoutes((route) => {
      // Home page at /
      route("/", "routes/index.tsx");

      // Shopify auth
      route("auth/login", "routes/auth.login/route.tsx");
      route("auth/:any", "routes/auth.$.tsx");

      // Webhooks
      route(
        "webhooks/app/uninstalled",
        "routes/webhooks.app.uninstalled.tsx"
      );

      // Embedded app frame
      route("app", "routes/app.tsx", (app) => {
        app.route("additional", "routes/app.additional.tsx");
      });
    }),
};
