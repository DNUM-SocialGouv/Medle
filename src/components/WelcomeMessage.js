import PropTypes from "prop-types"
import React, { useState } from "react"

const WelcomeMessage = ({ message }) => {
  const [dismissed, setDismissed] = useState(false)
  return (
    <div
      className={`alert alert-warning alert-dismissible w-100 mx-5 mt-3 mb-0 mb-md-5 py-3 overflow-auto ${
        dismissed && "d-none"
      }`}
      style={{ maxHeight: 200 }}
      role="alert"
    >
      <div className="mb-2">{/* <em>01/06/2020</em> */}</div>
      <div className="text-justify">
        {message}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Fermer ce message"
          onClick={() => setDismissed(true)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  )
}

WelcomeMessage.propTypes = {
  message: PropTypes.string,
}

export default WelcomeMessage
