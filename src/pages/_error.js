import Error from "next/error"
import PropTypes from "prop-types"
import React from "react"

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
  // Workaround for https://github.com/zeit/next.js/issues/8592, mark when getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  if (err) {
    Sentry.captureException(err)

    return errorInitialProps
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
