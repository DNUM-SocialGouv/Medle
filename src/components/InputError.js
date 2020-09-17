import React from "react"
import PropTypes from "prop-types"
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined"

export const InputError = ({ children }) => {
  return (
    <div className="d-flex align-items-center mt-1">
      <ErrorOutlineOutlinedIcon fontSize="small" className="mr-1" />
      &nbsp;
      {children}
    </div>
  )
}

InputError.propTypes = {
  children: PropTypes.node,
}
