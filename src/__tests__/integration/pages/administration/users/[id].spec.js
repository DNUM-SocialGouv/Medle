import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import { rest } from "msw"
import { setupServer } from "msw/node"
import * as nextRouter from "next/router"
import React from "react"

import { API_URL, USERS_ENDPOINT } from "../../../../../config"
import UserDetail from "../../../../../pages/administration/users/[id]"

describe("tests administration user", () => {
  const server = setupServer(
    rest.get(`${API_URL}${USERS_ENDPOINT}/42}`, (req, res, ctx) => {
      const { userId } = req.params
      return res(ctx.json({ data: "toto", userId }))
    })
  )

  beforeAll(() => {
    server.listen()
    /* eslint-disable no-import-assign*/
    nextRouter.useRouter = jest.fn()
    nextRouter.useRouter.mockImplementation(() => ({ query: { id: faker.random.number() } }))
  })

  afterAll(() => server.close())

  it("should not display Zone dangereuse for a new user", async () => {
    render(<UserDetail currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    // await expect(titleDangerousZone).rejects.toMatchInlineSnapshot()
    expect(screen.queryByText("Zone dangereuse")).not.toBeInTheDocument()
    expect(screen.queryByText("Retour à la liste")).not.toBeInTheDocument()
    expect(screen.queryByText("Ajouter")).toBeInTheDocument()

    // expect(rendered).toMatchInlineSnapshot()
  })

  it("should display Zone dangereuse for an existing user", async () => {
    render(<UserDetail initialUser={{ id: 42 }} currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    expect(screen.queryByText("Zone dangereuse")).toBeInTheDocument()
    expect(screen.queryByText("Modifier")).toBeInTheDocument()
  })

  it("should display errors when clicking too early on Ajouter button", async () => {
    render(<UserDetail currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    expect(screen.queryByText("Retour à la liste")).not.toBeInTheDocument()

    expect(screen.queryByText("Ajouter")).toBeInTheDocument()

    await act(async () => {
      userEvent.click(screen.getByText("Ajouter"))
    })

    await screen.findByText(/Le nom est obligatoire./i)
    await screen.findByText(/Courriel a un format incorrect./i)

    const expectedButton = await screen.queryByText("Retour à la liste")

    expect(expectedButton).not.toBeInTheDocument()
  })
})
