require("dotenv").config()

const webpack = require("webpack")

module.exports = {
   cssLoaderOptions: {
      url: false,
   },
   env: {
      // Build-time replaced env variables
      SENTRY_DSN: process.env.SENTRY_DSN,
      MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
      MATOMO_URL: process.env.MATOMO_URL,
   },
   publicRuntimeConfig: {
      // Will be available on both server and client. Needs getInitialProps on page to be available
      POSTGRES_SSL: process.env.POSTGRES_SSL,
      API_URL: process.env.API_URL,
      TEST_CURRENT_DATE: process.env.TEST_CURRENT_DATE,
   },
   serverRuntimeConfig: {
      // Will only be available on the server side. Needs getInitialProps on page to be available
      JWT_SECRET: process.env.JWT_SECRET,
   },
   webpack: (config, { isServer, buildId }) => {
      config.plugins.push(
         new webpack.DefinePlugin({
            // looks like it doesnt work for some reason
            "process.env.SENTRY_RELEASE": JSON.stringify(buildId),
         }),
      )

      if (!isServer) {
         config.resolve.alias["@sentry/node"] = "@sentry/browser"
      }

      return config
   },
}
