import { MDXProvider } from "@mdx-js/react"
import { PropTypes } from "prop-types"
import React from "react"
import { Container } from "reactstrap"

import { useUser } from "../hooks/useUser"
import Layout from "./Layout"
import { Title1 } from "./StyledComponents"

// TODO: Section/Question/SubQuestion/Answer ont été faits à l'origin pour la FAQ. Voir si l'on crée un autre style
// pour les autres pages ou si l'on renomme avec des noms plus génériques
const Section = ({ children }) => (
  <>
    <h2 className="mt-5 text-left border-bottom text-capitalize font-weight-bold">{children}</h2>
    <style jsx>{`
      h2 {
        font-family: Evolventa;
        font-size: 18px;
        color: #d4451b;
      }
    `}</style>
  </>
)

const Question = ({ children }) => (
  <>
    <h3 className="mt-5 text-left text-info">{children}</h3>
    <style jsx>{`
      h3 {
        font-family: Evolventa;
        font-size: 17px;
      }
    `}</style>
  </>
)

const SubQuestion = ({ children }) => (
  <>
    <h4 className="mt-5 text-left text-info">{children}</h4>
    <style jsx>{`
      h4 {
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

SubQuestion.propTypes = Section.propTypes

Answer.propTypes = Section.propTypes

const mdComponents = {
  h2: function SectionWrapper(props) {
    return <Section {...props} />
  },
  h3: function QuestionWrapper(props) {
    return <Question {...props} />
  },
  h4: function SubQuestionWrapper(props) {
    return <SubQuestion {...props} />
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
