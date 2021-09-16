import PropTypes from "prop-types"
import React, { useState } from "react"

const TabButton = ({ labels, callback, colorScheme, ariaLabel }) => {
  const [selectedLabel, setSelectedLabel] = useState(labels?.length ? labels[0] : "")

  if (colorScheme !== "violet") colorScheme = "blue"

  const onClick = (label) => {
    setSelectedLabel(label)
    callback(label)
  }

  return (
    <>
      <div className="mt-3 btn-group btn-group-toggle" role="group" aria-label={ariaLabel}>
        {labels.map((label, index) => (
          <label
            key={index}
            className={`btn ${
              selectedLabel === label ? `active medle-btn-${colorScheme}` : `medle-btn-outline-${colorScheme}`
            }`}
            style={{ zIndex: 0 }}
          >
            <input type="radio" name="radio" onClick={() => onClick(label)} className="inputRadio" />
            {label}
          </label>
        ))}
      </div>
      <style jsx>{`
        .medle-btn-blue {
          color: #fff;
          background-color: #307df6;
          border-color: #307df6;
        }
        .medle-btn-blue:focus-within {
          color: #fff;
          background-color: #2052a1;
          border-color: #307df6;
        }
        .medle-btn-outline-blue {
          color: #307df6;
          border-color: #307df6;
        }
        .medle-btn-outline-blue:hover {
          color: #fff;
          background-color: #5996f7;
          border-color: #5996f7;
        }
        .medle-btn-outline-blue:focus-within {
          color: #fff;
          background-color: #2052a1;
          border-color: #307df6;
        }
        .medle-btn-violet {
          color: #fff;
          background-color: #9c27b0;
          border-color: #cd92d7;
        }
        .medle-btn-violet:focus-within {
          color: #fff;
          background-color: #61196e;
          border-color: #cd92d7;
        }
        .medle-btn-outline-violet {
          color: #9c27b0;
          border-color: #cd92d7;
        }
        .medle-btn-outline-violet:hover {
          color: #fff;
          background-color: #cd92d7;
          border-color: #cd92d7;
        }
        .medle-btn-outline-violet:focus-within {
          color: #fff;
          background-color: #61196e;
          border-color: #cd92d7;
        }
      `}</style>
    </>
  )
}

TabButton.propTypes = {
  labels: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  colorScheme: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
}

export default TabButton
