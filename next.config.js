require("dotenv").config()

const withCSS = require("@zeit/next-css")
module.exports = withCSS({})

module.exports = {
   env: {
      API_URL: process.env.API_URL,
   },
   webpack: function(cfg) {
     const originalEntry = cfg.entry
     cfg.entry = async () => {
       const entries = await originalEntry()

       if (
         entries['main.js'] &&
         !entries['main.js'].includes('./client/polyfills.js')
       ) {
         entries['main.js'].unshift('./client/polyfills.js')
       }

       return entries
     }

     return cfg
   },
}
