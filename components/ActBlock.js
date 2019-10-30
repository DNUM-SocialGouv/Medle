import React, { useState } from "react"
import PropTypes from "prop-types"
import { ButtonDropdown, Col, DropdownItem, DropdownMenu, Row } from "reactstrap"

import { Button, DropdownToggle, Title2 } from "./StyledComponents"

const ActBlock = ({ title, subTitle, type, values, dispatch, state }) => {
   const [dropdownOpen, setOpen] = useState(false)
   const toggle = () => setOpen(!dropdownOpen)

   const nbColumns = values.length && values.length >= 4 ? { sm: 3 } : {}

   return (
      <>
         {title && <Title2 className="mb-4 mt-5">{title}</Title2>}

         {subTitle && (
            <Row className="mt-3">
               <Col sm={4} className="mb-1">
                  {subTitle}
               </Col>
            </Row>
         )}

         <Row>
            {values.map((val, index) => {
               if (val.subValues) {
                  const isClicked = state[type] && val.subValues.includes(state[type])
                  return (
                     <>
                        <Col key={index} {...nbColumns} className="mb-4">
                           <ButtonDropdown className="btn-block" isOpen={dropdownOpen} toggle={toggle}>
                              <DropdownToggle outline color="secondary" invert={isClicked} caret>
                                 {isClicked ? state[type] : val.title}
                              </DropdownToggle>
                              <DropdownMenu>
                                 {val.subValues.map((sub, indexS) => (
                                    <DropdownItem key={indexS} onClick={() => dispatch({ type, payload: sub })}>
                                       {sub}
                                    </DropdownItem>
                                 ))}
                              </DropdownMenu>
                           </ButtonDropdown>
                        </Col>
                     </>
                  )
               } else if (val.subTitle) {
                  return (
                     <Col key={index} {...nbColumns} className="mb-4">
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state[type] === val.title ? 1 : 0}
                           onClick={() => dispatch({ type, payload: val.title })}
                        >
                           {val.title}
                           <br />
                           {val.subTitle}
                        </Button>
                     </Col>
                  )
               } else
                  return (
                     <Col key={index} {...nbColumns} className="mb-4">
                        <Button
                           outline
                           color="secondary"
                           block
                           invert={state[type] === val ? 1 : 0}
                           onClick={() => dispatch({ type, payload: val })}
                        >
                           {val}
                        </Button>
                     </Col>
                  )
            })}
         </Row>
      </>
   )
}

ActBlock.propTypes = {
   title: PropTypes.string,
   subTitle: PropTypes.string,
   type: PropTypes.string.isRequired,
   values: PropTypes.array.isRequired,
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
}

export default ActBlock
