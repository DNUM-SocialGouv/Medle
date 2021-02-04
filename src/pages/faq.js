import { MDXProvider } from "@mdx-js/react"
import { PropTypes } from "prop-types"
import React from "react"
import { Container } from "reactstrap"

import { Question, Section } from "../components/Faq"
import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import FAQ from "../faq/faq.mdx"
import { withAuthentication } from "../utils/auth"

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
