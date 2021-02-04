import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline"
import PropTypes from "prop-types"
import React from "react"

const Counter = ({ children, dispatch, state, type }) => {
  const add = () => {
    dispatch({ type, payload: { mode: "replace", val: state + 1 } })
  }

  const substract = () => {
    const res = state - 1 > 0 ? state - 1 : 0
    dispatch({ type, payload: { mode: "replace", val: res } })
  }

  const keyPress = (event, fn) => event.key === "Enter" && fn(event)

  return (
    <>
      <div className="text-center title">{children}</div>
      <div className="mt-3 text-center content">
        <RemoveCircleOutline
          onClick={substract}
          className="mr-3"
          tabIndex="0"
          onKeyPress={(e) => keyPress(e, substract)}
          width={24}
        />
        {state}
        <AddCircleOutline onClick={add} className="ml-3" tabIndex="0" onKeyPress={(e) => keyPress(e, add)} width={24} />
      </div>
      <style jsx>{`
        .title {
          font-size: 14px;
        }
        .content {
          font-size: 20px;
        }
      `}</style>
    </>
  )
}

Counter.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
}

export default Counter
