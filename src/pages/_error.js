import React from "react"
import Error from "next/error"
import PropTypes from "prop-types"

import sentry from "../utils/sentry"

const { Sentry } = sentry()

const MyError = ({ hasGetInitialPropsRun, statusCode, err }) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err)
  }

  return (
    <div>
      <div className="alert alert-warning">Une erreur {statusCode} est apparue ¯\_(ツ)_/¯</div>
    </div>
  )
}

MyError.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = await Error.getInitialProps({ res, err })
  // Workaround for https://github.com/zeit/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  if (res) {
    // Running on the server, the response object is available.
    //
    // Next.js will pass an err on the server if a page's `getInitialProps`
    // threw or returned a Promise that rejected

    if (err) {
      Sentry.captureException(err)

      return errorInitialProps
    }
  } else {
    // Running on the client (browser).
    //
    // Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    if (err) {
      Sentry.captureException(err)

      return errorInitialProps
    }
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureMessage(`_error.js status=${res && res.statusCode} getInitialProps missing data at path: ${asPath}`)

  return errorInitialProps
}

MyError.propTypes = {
  hasGetInitialPropsRun: PropTypes.bool,
  statusCode: PropTypes.number,
  err: PropTypes.string,
}

export default MyError
