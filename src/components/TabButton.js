import PropTypes from "prop-types"
import React, { useState } from "react"

const TabButton = ({ labels, callback, colorScheme, legend }) => {
  const [selectedLabel, setSelectedLabel] = useState(labels?.length ? labels[0] : "")

  if (colorScheme !== "violet") colorScheme = "blue"

  const onClick = (label) => {
    setSelectedLabel(label)
    callback(label)
  }

  return (
    <>
      <fieldset className="mt-3 btn-group btn-group-toggle">
        <legend className="sr-only">{legend}</legend>
        {labels.map((label, index) => (
          <label
            key={index}
            className={`btn ${
              selectedLabel === label ? `active medle-btn-${colorScheme}` : `medle-btn-outline-${colorScheme}`
            }`}
            style={{ zIndex: 0 }}
            htmlFor={`radio${label}`}
          >
            <input
              id={`radio${label}`}
              type="radio"
              name="radio"
              onClick={() => onClick(label)}
              className="inputRadio"
            />
            {label}
          </label>
        ))}
      </fieldset>
      <style jsx>{`
        .medle-btn-blue {
          color: #fff;
          background-color: #2e73e2;
          border-color: #2e73e2;
        }
        .medle-btn-blue:focus-within {
          color: #fff;
          background-color: #2052a1;
          border-color: #2e73e2;
        }
        .medle-btn-outline-blue {
          color: #2e73e2;
          border-color: #2e73e2;
        }
        .medle-btn-outline-blue:hover {
          color: #fff;
          background-color: #5795f3;
          border-color: #5795f3;
        }
        .medle-btn-outline-blue:focus-within {
          color: #fff;
          background-color: #2052a1;
          border-color: #2e73e2;
        }
        .medle-btn-violet {
          color: #fff;
          background-color: #9c27b0;
          border-color: #cd73d4;
        }
        .medle-btn-violet:focus-within {
          color: #fff;
          background-color: #61196e;
          border-color: #cd73d4;
        }
        .medle-btn-outline-violet {
          color: #9c27b0;
          border-color: #cd73d4;
        }
        .medle-btn-outline-violet:hover {
          color: #fff;
          background-color: #cd73d4;
          border-color: #cd73d4;
        }
        .medle-btn-outline-violet:focus-within {
          color: #fff;
          background-color: #61196e;
          border-color: #cd73d4;
        }
      `}</style>
    </>
  )
}

TabButton.propTypes = {
  labels: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  colorScheme: PropTypes.string,
  legend: PropTypes.string.isRequired,
}

export default TabButton
