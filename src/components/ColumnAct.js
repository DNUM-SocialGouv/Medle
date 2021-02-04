import PropTypes from "prop-types"
import React from "react"

import { VerticalList } from "./VerticalList"

const ColumnAct = ({ header, content }) => {
  return (
    <>
      <p className="mb-0">{header}</p>
      <VerticalList content={content} style={{ fontWeight: "bold", paddingBottom: 5 }} />
    </>
  )
}

ColumnAct.defaultProps = {
  content: "",
}

ColumnAct.propTypes = {
  header: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
}

export default ColumnAct
