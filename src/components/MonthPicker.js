import React from "react"
import PropTypes from "prop-types"

import { NAME_MONTHS } from "../utils/date"

const formatMonth = (monthNumber) => monthNumber.toString().padStart(2, "0")

const MonthPicker = ({ value, onChange }) => {
  const { year, month } = value

  const add = () => {
    onChange({
      year: value.month === "12" ? value.year + 1 : value.year,
      month: formatMonth((Number(value.month) % 12) + 1),
    })
  }

  const substract = () => {
    onChange({
      year: value.month === "01" ? value.year - 1 : value.year,
      month: value.month === "01" ? "12" : formatMonth(Number(value.month) - 1),
    })
  }

  // A11y keyboard navigation: push space key to activate the button
  const keyPress = (event, fn) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      fn(event)
    }
  }

  return (
    <>
      <svg
        onClick={substract}
        onKeyPress={(e) => keyPress(e, substract)}
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="mr-4 bg-secondary rounded-circle"
        style={{ width: 24, height: 24 }}
        tabIndex="0"
      >
        <path
          fill="#FFF"
          d="M16 10c0 .553-.048 1-.601 1H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H15.4c.552 0 .6.447.6 1z"
        ></path>
      </svg>
      <span className="d-inline-block text-center" style={{ width: 120 }}>
        {NAME_MONTHS[month]} {year}
      </span>

      <svg
        onClick={add}
        onKeyPress={(e) => keyPress(e, add)}
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="w-8 h-8 p-1 ml-4 bg-secondary rounded-circle"
        style={{ width: 24, height: 24 }}
        tabIndex="0"
      >
        <path
          fill="#FFF"
          d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"
        ></path>
      </svg>
    </>
  )
}

MonthPicker.propTypes = {
  value: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func,
}

export default MonthPicker
