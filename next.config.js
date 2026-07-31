const { version } = require('./package.json');

const commonSecurityHeaders = [
  /**
   * Permissions-Policy, see: https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/
   * This header provides a mechanism to allow or deny the use of browser features in its own frame, and in content
   * within any <iframe> elements in the document.
   *
   * CHOICE: disable all the features that we are not currently using.
   **/
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), microphone=(), geolocation=(), document-domain=(), gyroscope=(), magnetometer=(), payment=(), usb=(), xr-spatial-tracking=()",
  },
  /**
   * Referrer-Policy, see: https://scotthelme.co.uk/a-new-security-header-referrer-policy/
   * This header lets know where the visitor of the site came from. This header allows to control or restrict the amount
   * of information sent to the destination site.
   *
   * CHOICE: the browser will send the full URL to HTTPS requests to the same origin, and will send origin URL when the HTTPS requests are cross-origin.
   **/
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  /**
   * X-Content-Type-Options, see: https://scotthelme.co.uk/hardening-your-http-response-headers/
   * This header prevents the browser from attempting to guess the type of content if the Content-Type header is not explicitly set
   * There is only one value "nosniff"
   **/
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  /**
   * X-Frame-Options, see: https://scotthelme.co.uk/hardening-your-http-response-headers/
   * This header prevents against clickjacking attacks.
   *
   * CHOICE: The value "SAMEORIGIN" allows you to frame your own site
   **/
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

const devSecurityHeader = [...commonSecurityHeaders,
/**
  * We remove the «https:» directive and add the unsafe-eval to the script-src necessary for React on Dev env
  **/
{
  key: "Content-Security-Policy",
  value: "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; img-src http: data: blob:; font-src 'self' data:;",
},
];

const productionSecurityHeaders = [...commonSecurityHeaders,
/**
 * Strict-Transport-Security, see: https://scotthelme.co.uk/hsts-the-missing-link-in-tls/
 * This header enforces the use of HTTPS.
 **/
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains",
},
/**
 * Content-Security-Policy, see: https://scotthelme.co.uk/content-security-policy-an-introduction/
 * This header define approved sources for content on the site that the browser can load.
 * By default we only load from the app domain on an HTTPS connection.
 * unsafe-inline in necessary for NextJS
 **/
{
  key: "Content-Security-Policy",
  value: "default-src https: 'self' 'unsafe-inline'; img-src https: data: blob:; font-src 'self' data:;",
},
];

const nextConfig = {
  env: {
    MEDLE_VERSION: version,
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
  async headers() {
    return process.env["NODE_ENV"] === "development"
      ? [
        {
          headers: devSecurityHeader,
          source: "/:path*",
        }
      ]
      : [
        {
          headers: productionSecurityHeaders,
          source: "/:path*",
        },
        {
          headers: [{ key: "Cache-Control", value: "max-age=31536000" }],
          source: "/(smarttag.js|favicon.ico|logo.svg)",
        },
      ];
  }
}

module.exports = nextConfig
