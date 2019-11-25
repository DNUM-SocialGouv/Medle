import React from "react"
import PropTypes from "prop-types"

const ColumnAct = ({ header, values }) => {
   console.log("values", values)

   const val = !values
      ? ""
      : values instanceof Array
      ? values.map((v, index) => [<span key={index}>{v}</span>, <br key={`${index}-br`} />])
      : values

   return (
      <>
         <p>{header}</p>
         <p style={{ fontWeight: "bold" }}>{val}</p>
      </>
   )
}

ColumnAct.propTypes = {
   header: PropTypes.string,
   values: PropTypes.oneOfType[(PropTypes.string, PropTypes.array)],
}

export default ColumnAct
