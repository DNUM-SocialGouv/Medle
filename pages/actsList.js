import React from "react"
import { withAuthSync } from "../utils/auth"
import Layout from "../components/layout"

const actsListPage = () => (
   <Layout>
      <h2>Page de la liste des actes</h2>
   </Layout>
)

export default withAuthSync(actsListPage)
