require("dotenv").config()

const withCSS = require("@zeit/next-css")

module.exports = withCSS({
   cssLoaderOptions: {
      url: false,
   },
   env: {
      API_URL: process.env.API_URL,
      MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
      MATOMO_URL: process.env.MATOMO_URL,
   },
   publicRuntimeConfig: {
      // Will be available on both server and client
      TEST_CURRENT_DATE: process.env.TEST_CURRENT_DATE,
   },
   serverRuntimeConfig: {
      // Will only be available on the server side
      JWT_SECRET: process.env.JWT_SECRET,
   },
})
