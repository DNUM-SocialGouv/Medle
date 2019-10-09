import React from "react"
import { withAuthSync } from "../utils/auth"

const actsListPage = () => <h2>Page de la liste des actes</h2>

export default withAuthSync(actsListPage)
