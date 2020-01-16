import React from "react"
import PropTypes from "prop-types"

export const VerticalList = ({ content, style }) => {
   if (!content) return null

   if (content instanceof Array)
      return content.map((item, key) => (
         <span key={key} style={style}>
            {item}
            <br />
         </span>
      ))

   return <p style={style}>{content}</p>
}

VerticalList.propTypes = {
   content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
   style: PropTypes.object,
}
