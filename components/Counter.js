import React from "react"
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons"
import PropTypes from "prop-types"

const Counter = ({ children, dispatch, state, type }) => {
   const add = () => {
      dispatch({ type, payload: state[type] + 1 })
   }

   const substract = () => {
      const res = state[type] - 1 > 0 ? state[type] - 1 : 0
      dispatch({ type, payload: res })
   }

   return (
      <>
         <div className="text-center title">{children}</div>
         <div className="mt-3 text-center content">
            <RemoveCircleOutline onClick={substract} className="mr-3" />
            {state[type]}
            <AddCircleOutline onClick={add} className="ml-3" />
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
   state: PropTypes.object.isRequired,
   type: PropTypes.string.isRequired,
}

export default Counter
