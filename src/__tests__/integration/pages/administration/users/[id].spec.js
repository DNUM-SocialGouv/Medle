import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import * as nextRouter from "next/router"
import React from "react"

import UserDetail from "../../../../../pages/administration/users/[id]"

import { mockRouterImplementation } from "../../../../../utils/test-utils"

jest.spyOn(nextRouter, "useRouter")

describe("tests administration user", () => {
  beforeAll(() => {
    /* eslint-disable no-import-assign*/
    nextRouter.useRouter.mockImplementation(() => ({
      ...mockRouterImplementation,
      query: { id: faker.random.number() },
    }))
  })

  afterAll(() => {
    nextRouter.useRouter.mockRestore()
  })

  it("should not display Zone dangereuse for a new user", async () => {
    render(<UserDetail currentUser={{ role: "ADMIN_HOSPITAL" }} />)

    expect(screen.queryByText("Zone dangereuse")).not.toBeInTheDocument()
    expect(screen.queryByText("Retour à la liste")).not.toBeInTheDocument()
    expect(screen.queryByText("Ajouter")).toBeInTheDocument()

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

    userEvent.click(screen.getByText("Ajouter"))

    await screen.findByText(/Le nom est obligatoire./i)
    await screen.findByText(/Courriel a un format incorrect./i)

    expect(screen.queryByText("Retour à la liste")).not.toBeInTheDocument()
  })
})
