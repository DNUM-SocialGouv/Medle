import PropTypes from "prop-types"
import React from "react"
import { Alert } from "reactstrap"
/**
 * @typedef {"idle" | "pending" | "error" | "sucess"} StatusType
 */

/**
 * Display an error or a success message.
 *
 * @param {Object} status              - Status object.
 * @param {StatusType} status.type     - Status type.
 * @param {string} [status.message]    - Message (optionnal).
 * @param {string} [status.className]  - CSS classnames (optionnal).
 */
export default function StatusAlert({ type, message = "", className }) {
  const color = type === "error" ? "danger" : type === "success" ? "success" : "info"

  return (
    <Alert color={color} className={className}>
      {message}
    </Alert>
  )
}

StatusAlert.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string.isRequired,
}
