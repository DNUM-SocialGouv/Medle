import React from "react"
import { PropTypes } from "prop-types"
import Layout from "../components/Layout"
import { Container } from "reactstrap"
import { Title1 } from "../components/StyledComponents"
import { withAuthentication } from "../utils/auth"
import { Section, Question } from "../components/Faq"
import { MDXProvider } from "@mdx-js/react"

import FAQ from "../faq/faq.mdx"

const mdComponents = {
  h1: function SectionWrapper(props) {
    return <Section {...props} />
  },
  h2: function QuestionWrapper(props) {
    return <Question {...props} />
  },
}

const FaqPage = ({ currentUser }) => {
  return (
    <MDXProvider components={mdComponents}>
      <Layout currentUser={currentUser}>
        <Container style={{ maxWidth: 720 }}>
          <Title1 className="mt-5 mb-5">Foire aux questions</Title1>
          <FAQ />
        </Container>
      </Layout>
    </MDXProvider>
  )
}

FaqPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(FaqPage, null, { redirect: false })
