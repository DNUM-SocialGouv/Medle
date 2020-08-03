import React from "react"
import renderer from "react-test-renderer"
import * as nextRouter from "next/router"

import UserDetail from "../../../pages/administration/users/[id]"
import { SUPER_ADMIN } from "../../../utils/roles"

// API dependency for pages's getInitialProps

it("should renders UserDetail unchanged", () => {
  /* eslint-disable  no-import-assign */
  nextRouter.useRouter = jest.fn()
  nextRouter.useRouter.mockImplementation(() => ({ query: { id: "3" } }))

  const currentUser = {
    id: 3,
    role: SUPER_ADMIN,
    hospital: null,
  }
  const tree = renderer.create(<UserDetail initialUser={{}} currentUser={currentUser} />).toJSON()
  expect(tree).toMatchSnapshot()
})
