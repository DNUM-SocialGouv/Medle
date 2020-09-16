import React from "react"
import PropTypes from "prop-types"
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined"

export const InputError = ({ children }) => {
  return (
    <>
      {children}&nbsp;
      <ErrorOutlineOutlinedIcon fontSize="small" />
    </>
  )
}

InputError.propTypes = {
  children: PropTypes.node,
}
