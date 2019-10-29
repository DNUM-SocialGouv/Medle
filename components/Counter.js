import React from "react"
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons"
import PropTypes from "prop-types"

const Counter = ({ children }) => {
   const add = () => setValue(prec => prec + 1)
   const substract = () =>
      setValue(prec => {
         return prec - 1 > 0 ? prec - 1 : 0
      })

   const [value, setValue] = React.useState(0)

   return (
      <>
         <div className="text-center title">{children}</div>
         <div className="mt-3 text-center content">
            <RemoveCircleOutline onClick={substract} className="mr-3" />
            {value}
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
}

export default Counter
