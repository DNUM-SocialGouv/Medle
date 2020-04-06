import React from "react"
import PropTypes from "prop-types"

export const SearchButton = ({ children, className }) => {
   return (
      <button type="button" className={`btn ${className}`}>
         {children}
      </button>
   )
}

SearchButton.propTypes = {
   children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
   className: PropTypes.string,
}
