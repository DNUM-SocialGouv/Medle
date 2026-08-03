import * as nextRouter from "next/router"
import React from "react"
import { render, screen } from "@testing-library/react"

import UserDetail from "../../../pages/administration/users/[id]"
import { SUPER_ADMIN } from "../../../utils/roles"

// API dependency for pages's getInitialProps

it("should renders UserDetail with correct title for new user", () => {
  /* eslint-disable  no-import-assign */
  nextRouter.useRouter = jest.fn()
  nextRouter.useRouter.mockImplementation(() => ({ query: { id: "3" } }))

  const currentUser = {
    id: 3,
    role: SUPER_ADMIN,
    hospital: null,
  }
  render(<UserDetail initialUser={{}} currentUser={currentUser} />)
  
  expect(screen.getByText(/Ajouter un utilisateur/i)).toBeInTheDocument()
})
