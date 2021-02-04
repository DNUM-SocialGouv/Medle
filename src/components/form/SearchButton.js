import PropTypes from "prop-types"
import React from "react"

export const SearchButton = ({ children, className, onClick }) => {
  return (
    <button type="button" className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

SearchButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  onClick: PropTypes.func,
}
