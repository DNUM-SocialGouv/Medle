import React, { useState } from "react"
import PropTypes from "prop-types"

const TabButton = ({ labels, callback }) => {
   const [selectedLabel, setSelectedLabel] = useState(labels && labels.length ? labels[0] : "")

   const onClick = label => {
      setSelectedLabel(label)
      callback(label)
   }

   return (
      <>
         <div className="pb-4 btn-group btn-group-toggle">
            {labels.map((label, index) => (
               <label
                  key={index}
                  className={`btn ${
                     selectedLabel === label ? "active medle-btn-primary" : "medle-btn-outline-primary"
                  }`}
               >
                  <input type="radio" name="radio" onClick={() => onClick(label)} />
                  {label}
               </label>
            ))}
         </div>
         <style jsx>{`
            .medle-btn-primary {
               color: #fff;
               background-color: #307df6;
               border-color: #307df6;
            }
            .medle-btn-outline-primary {
               color: #307df6;
               border-color: #307df6;
            }
            .medle-btn-outline-primary:hover {
               color: #fff;
               background-color: #5996f7;
               border-color: #5996f7;
            }
         `}</style>
      </>
   )
}

TabButton.propTypes = {
   labels: PropTypes.array.isRequired,
   callback: PropTypes.func.isRequired,
}

export default TabButton
