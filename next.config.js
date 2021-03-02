const withPlugins = require("next-compose-plugins")
const withTM = require("next-transpile-modules")(["d3-scale", "d3-array"])
const images = require("remark-images")
const emoji = require("remark-emoji")

const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        mdPlugins: [images, emoji],
    },
})

const nextConfig = {
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
        // APP_BASE_URL variable is available on the deployment environment only
        API_URL: process.env.APP_BASE_URL ? `${process.env.APP_BASE_URL}${process.env.API_URL}` : process.env.API_URL,
        TEST_CURRENT_DATE: process.env.TEST_CURRENT_DATE,
        DEBUG_MODE: process.env.DEBUG_MODE,
        FEATURE_FLAGS: {
            notification: false,
            administration: true,
            directory: false,
            resources: false,
            export: true,
        },
    },
    serverRuntimeConfig: {
        // Will only be available on the server side. Needs getInitialProps on page to be available
        // DB_URI variable is available on the deployment environment only
        JWT_SECRET: process.env.JWT_SECRET,
        POSTGRES_SSL: process.env.POSTGRES_SSL,
        DATABASE_URL: process.env.DB_URI || process.env.DATABASE_URL,
    },
    webpack: (config, { isServer, buildId, webpack }) => {
        //config.optimization.minimizer = []

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

module.exports = withPlugins(
    [
        [withTM],
        [
            withMDX,
            {
                pageExtensions: ["js", "jsx", "md", "mdx"],
            },
        ],
    ],
    nextConfig,
)
