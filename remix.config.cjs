// remix.config.cjs
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],

  routes: async (defineRoutes) =>
    defineRoutes((route) => {
      // Root index
      route('/', 'routes/index.tsx');

      // Shopify auth
      route('auth/login', 'routes/auth.login/route.tsx');
      route('auth/:any', 'routes/auth.$.tsx');

      // Webhooks
      route('webhooks/app/uninstalled', 'routes/webhooks.app.uninstalled.tsx');

      // Embedded App frame
      route('app', 'routes/app.tsx');
      route('app/additional', 'routes/app.additional.tsx');
    }),
};
