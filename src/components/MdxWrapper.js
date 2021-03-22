import { MDXProvider } from "@mdx-js/react"
import { PropTypes } from "prop-types"
import React from "react"
import { Container } from "reactstrap"

import { useUser } from "../hooks/useUser"
import Layout from "./Layout"
import { Title1 } from "./StyledComponents"

// TODO: Section/Question/Answer ont été faits à l'origin pour la FAQ. Voir si l'on crée un autre style
// pour les autres pages ou si l'on renomme avec des noms plus génériques
const Section = ({ children }) => (
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

const Question = ({ children }) => (
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
const Answer = ({ children }) => <div dangerouslySetInnerHTML={{ __html: children }} />

Section.propTypes = {
  children: PropTypes.node.isRequired,
}
Question.propTypes = Section.propTypes

Answer.propTypes = Section.propTypes

const mdComponents = {
  h1: function SectionWrapper(props) {
    return <Section {...props} />
  },
  h2: function QuestionWrapper(props) {
    return <Question {...props} />
  },
}

const MdxWrapper = ({ title = "default title", mdx }) => {
  const currentUser = useUser()

  return (
    <MDXProvider components={mdComponents}>
      <Layout currentUser={currentUser}>
        <Container style={{ maxWidth: 720 }}>
          <Title1 className="mt-5 mb-5">{title}</Title1>
          {mdx}
        </Container>
      </Layout>
    </MDXProvider>
  )
}

MdxWrapper.propTypes = {
  mdx: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
}

export default MdxWrapper
