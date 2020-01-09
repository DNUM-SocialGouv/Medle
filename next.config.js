require("dotenv").config()

const withCSS = require("@zeit/next-css")

module.exports = withCSS({
   cssLoaderOptions: {
      url: false,
   },
   env: {
      API_URL: process.env.API_URL,
   },
   serverRuntimeConfig: {
      JWT_SECRET: process.env.JWT_SECRET,
   },
})
