import React from "react"
import renderer from "react-test-renderer"
import UserDetail from "../../../pages/administration/users/[id]"
import { SUPER_ADMIN } from "../../../utils/roles"
import * as nextRouter from "next/router"

it("renders UserDetail unchanged", () => {
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
