import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import UserDetail from "../../../../../pages/administration/users/[id]"

import { API_URL, ADMIN_USERS_ENDPOINT } from "../../../../../config"

import { render, screen, fireEvent } from "@testing-library/react"
import * as nextRouter from "next/router"

describe("tests administration user", () => {
  const server = setupServer(
    rest.get(`${API_URL}${ADMIN_USERS_ENDPOINT}/:userId}`, (req, res, ctx) => {
      const { userId } = req.params
      return res(ctx.json({ data: "toto", userId }))
    })
  )

  beforeAll(() => {
    server.listen()
  })
  afterAll(() => server.close())

  it("should not display Zone dangereuse for a new user", async () => {
    nextRouter.useRouter = jest.fn()
    nextRouter.useRouter.mockImplementation(() => ({ query: { id: "3" } }))

    render(<UserDetail currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    // await expect(titleDangerousZone).rejects.toMatchInlineSnapshot()
    expect(screen.queryByText("Zone dangereuse")).toBeNull()
    expect(screen.queryByText("Retour à la liste")).toBeNull()
    expect(screen.queryByText("Ajouter")).not.toBeNull()

    // expect(rendered).toMatchInlineSnapshot()
  })

  it("should display Zone dangereuse for an existing user", async () => {
    nextRouter.useRouter = jest.fn()
    nextRouter.useRouter.mockImplementation(() => ({ query: { id: "3" } }))

    render(<UserDetail initialUser={{ id: 42 }} currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    expect(screen.queryByText("Zone dangereuse")).not.toBeNull()
    expect(screen.queryByText("Modifier")).not.toBeNull()
  })

  it("should display Retour à la liste after successful update", async () => {
    nextRouter.useRouter = jest.fn()
    nextRouter.useRouter.mockImplementation(() => ({ query: { id: "3" } }))

    render(<UserDetail currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    expect(screen.queryByText("Retour à la liste")).toBeNull()

    expect(screen.queryByText("Ajouter")).not.toBeNull()

    fireEvent.click(screen.getByText("Ajouter"))

    // const expectedButton = await screen.queryByText("Retour à la liste")

    // expect(expectedButton).not.toBeNull()
  })
})
