import PropTypes from "prop-types"
import React from "react"

const Badge = ({ value, label }) =>
  !value ? null : (
    <div className="text-center">
      <div className="mt-2 rounded-pill small py-1" style={{ backgroundColor: "#dce6ff", color: "#4a4a4a" }} aria-label={label}>
        {value}
      </div>
    </div>
  )

Badge.propTypes = {
  value: PropTypes.string,
}

export default Badge
