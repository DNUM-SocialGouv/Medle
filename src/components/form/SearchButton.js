import PropTypes from "prop-types"
import React from "react"

export const SearchButton = ({ children, className, onClick, disabled }) => {
  return (
    <button type="button" className={`btn ${className}`} disabled={Boolean(disabled)} onClick={onClick}>
      {children}
    </button>
  )
}

SearchButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}
