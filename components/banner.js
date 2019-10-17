import React from "react"
import { Container } from "reactstrap"
import PropTypes from "prop-types"

const Banner = ({ title }) => (
   <>
      <div>
         <Container>
            <h1 className={"mt-3 mb-3"}>{title}</h1>
         </Container>
      </div>
      <style jsx>{`
         div {
            border: 1px solid lightgray;
            background-color: #0069e1;
            color: white;
            height: 100px;
            display: flex;
            align-items: center;
            margin-bottom: 50px;
         }
      `}</style>
   </>
)

Banner.propTypes = {
   title: PropTypes.string.isRequired,
}

export default Banner
