import { PropTypes } from "prop-types"
import React from "react"

export const Section = ({ children }) => (
  <>
    <h1 className="mt-5 text-left border-bottom text-capitalize font-weight-bold">{children}</h1>
    <style jsx>{`
      h1 {
        font-family: Evolventa;
        font-size: 18px;
        color: tomato;
      }
    `}</style>
  </>
)

export const Question = ({ children }) => (
  <>
    <h2 className="mt-5 text-left text-info">{children}</h2>
    <style jsx>{`
      h2 {
        font-family: Evolventa;
        font-size: 16px;
      }
    `}</style>
  </>
)
export const Answer = ({ children }) => <div dangerouslySetInnerHTML={{ __html: children }} />

Section.propTypes = {
  children: PropTypes.node.isRequired,
}
Question.propTypes = {
  children: PropTypes.node.isRequired,
}
Answer.propTypes = {
  children: PropTypes.node.isRequired,
}
