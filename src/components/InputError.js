import React from "react"
import PropTypes from "prop-types"
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined"

export const InputError = ({ children }) => {
  return (
    <div className="d-flex align-items-center">
      {children}&nbsp;
      <ErrorOutlineOutlinedIcon fontSize="small" />
    </div>
  )
}

InputError.propTypes = {
  children: PropTypes.node,
}
