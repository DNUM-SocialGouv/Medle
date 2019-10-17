import React from "react"
import { Container } from "reactstrap"
import PropTypes from "prop-types"
import { colors } from "../theme"

const Banner = ({ title }) => (
   <>
      <div>
         <Container>
            <h1 className={"mt-3 mb-3"}>{title}</h1>
         </Container>
      </div>
      <style jsx>{`
         div {
            border: 1px solid ${colors.banner.border};
            background-color: ${colors.banner.background};
            color: ${colors.banner.color};
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
