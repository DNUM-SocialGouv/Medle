import React, { useState } from "react"
import PropTypes from "prop-types"
import { ButtonDropdown, Col, DropdownItem, DropdownMenu, Row } from "reactstrap"

import { Button, DropdownToggle, Title2 } from "./StyledComponents"

const normalizeValues = values => {
  values.forEach(v => {
    if (typeof v !== "string" && typeof v !== "object") {
      throw new Error("Incompatible types for values")
    }
  })

  return values.map(v => {
    if (typeof v === "string") {
      return { title: v, subTitle: "", subValues: [] }
    } else {
      let resValue
      if (!v.subTitle) {
        resValue = { ...v, subTitle: "" }
      }
      if (!v.subValues) {
        resValue = { ...v, subValues: [] }
      }
      return resValue
    }
  })
}

const makeColOptions = values => {
  if (values.length) {
    if (values.length === 1) {
      return {
        sm: 3,
      }
    } else if (values.length >= 4) {
      return {
        sm: 3,
      }
    }
  }
  return {}
}

const isSelected = (stateType, val) => {
  if (stateType instanceof Array) {
    return stateType.includes(val) ? 1 : 0
  } else {
    return stateType === val ? 1 : 0
  }
}

const selectedSubvalueInState = (prefix, stateTypes) => {
  if (stateTypes instanceof Array) {
    const res = stateTypes.filter(elt => elt.startsWith(prefix))
    return res.length ? res[0] : false
  } else if (typeof stateTypes === "string") {
    return stateTypes.startsWith(prefix) ? stateTypes : false
  }
  return false
}

const BlockChildren = ({ title, values, state, dispatch, type, mode, colOptions }) => {
  const [dropdownOpen, setOpen] = useState(false)
  const toggle = () => setOpen(!dropdownOpen)

  const selectedSubvalue = selectedSubvalueInState(title, state)
  return (
    <Col {...colOptions} className="mb-4">
      <ButtonDropdown className="btn-block" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle outline color="secondary" invert={selectedSubvalue ? 1 : 0} caret>
          {selectedSubvalue ? selectedSubvalue : title}
        </DropdownToggle>
        <DropdownMenu>
          {values.map((sub, indexS) => (
            <DropdownItem
              key={indexS}
              onClick={() => {
                dispatch({
                  type,
                  payload: {
                    mode,
                    val: title + "/" + sub,
                  },
                })
              }}
            >
              {sub}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </Col>
  )
}

BlockChildren.propTypes = {
  title: PropTypes.string,
  values: PropTypes.array.isRequired,
  state: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  dispatch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  mode: PropTypes.string,
  colOptions: PropTypes.object,
}

const ActBlock = ({ title, subTitle, type, values, dispatch, state, invalid, mode }) => {
  const colOptions = makeColOptions(values)
  const rowClassNames = values.length && values.length === 1 ? "justify-content-center" : ""
  const colorOptions = invalid ? { color: "red" } : {}

  const newValues = normalizeValues(values)

  return (
    <>
      {title && (
        <Title2 className="mb-4 mt-5" style={colorOptions}>
          {title}
        </Title2>
      )}

      {subTitle && (
        <Row className="mt-3">
          <Col sm={4} className="mb-1" style={colorOptions}>
            {subTitle}
          </Col>
        </Row>
      )}

      <Row className={rowClassNames}>
        {newValues.map((val, index) => {
          if (val.subValues.length) {
            return (
              <BlockChildren
                key={index}
                title={val.title}
                values={val.subValues}
                state={state}
                dispatch={dispatch}
                type={type}
                mode={mode}
                colOptions={colOptions}
              />
            )
          } else {
            return (
              <Col key={index} {...colOptions} className="mb-4">
                <Button
                  style={{ fontSize: 14 }}
                  className="h-100"
                  outline
                  color="secondary"
                  block
                  invert={isSelected(state, val.title)}
                  onClick={() =>
                    dispatch({
                      type,
                      payload: {
                        mode,
                        val: val.title,
                      },
                    })
                  }
                >
                  {val.title}
                  <br />
                  {val.subTitle}
                </Button>
              </Col>
            )
          }
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
  state: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  invalid: PropTypes.bool,
  mode: PropTypes.string,
}

const areEqual = (prevProps, nextProps) => {
  if (
    prevProps.state !== nextProps.state ||
    prevProps.invalid !== nextProps.invalid ||
    prevProps.values !== nextProps.values
  )
    return false
  return true
}

export default React.memo(ActBlock, areEqual)
