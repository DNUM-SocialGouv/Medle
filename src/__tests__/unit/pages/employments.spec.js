import "@testing-library/jest-dom/extend-expect"

import { build, fake, oneOf, sequence } from "@jackfranklin/test-data-bot"
import { render, screen, waitFor } from "@testing-library/react"
import * as nextRouter from "next/router"
import React from "react"

import * as clientEmployments from "../../../clients/employments"
import { EmploymentsPage } from "../../../pages/employments/[[...hid]]"
import { EMPLOYMENT_CONSULTATION, PUBLIC_SUPERVISOR, REGIONAL_SUPERVISOR, SUPER_ADMIN } from "../../../utils/roles"
import * as scope from "../../../utils/scope"
import { mockRouterImplementation } from "../../../utils/test-utils"

beforeEach(() => {
  jest.spyOn(nextRouter, "useRouter")
  jest.spyOn(clientEmployments, "findLastEdit")
  jest.spyOn(scope, "hospitalsOfUser")
})

afterEach(() => {
  jest.restoreAllMocks()
})

const userBuilder = build("User", {
  fields: {
    firstName: fake((f) => f.name.firstName()),
    hospital: {
      id: sequence(),
    },
    id: sequence(),
    lastName: fake((f) => f.name.lastName()),
    role: oneOf([EMPLOYMENT_CONSULTATION, SUPER_ADMIN, REGIONAL_SUPERVISOR, PUBLIC_SUPERVISOR]),
    scope: [],
  },
})

const publicSupervisorBuilder = (options) =>
  userBuilder({
    overrides: {
      ...options,
      hospital: {},
      role: PUBLIC_SUPERVISOR,
      scope: [],
    },
  })

const regionalSupervisorBuilder = (options) => {
  if (!options?.scope?.length) throw new Error("The scope is required for a Regional Supervisor")

  return userBuilder({
    overrides: {
      ...options,
      hospital: {},
      role: REGIONAL_SUPERVISOR,
    },
  })
}

const hospitalBuilder = build({
  fields: {
    id: sequence(),
    name: fake((f) => f.address.city()),
  },
})

it("should render employments page with list for ministere people", async () => {
  const hospital1 = hospitalBuilder()
  const hospital2 = hospitalBuilder()

  const user = publicSupervisorBuilder()

  scope.hospitalsOfUser.mockReturnValue([hospital1, hospital2])

  clientEmployments.findLastEdit.mockImplementation(async () => ({}))

  // query without parameters
  nextRouter.useRouter.mockReturnValue({ ...mockRouterImplementation, query: {} })
  await waitFor(() => render(<EmploymentsPage currentUser={user} />))

  // We should go on list.
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).not.toBeInTheDocument()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(2)
})

it("should render employments page with list for regional people if no query", async () => {
  const hospital1 = hospitalBuilder()
  const hospital2 = hospitalBuilder()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  scope.hospitalsOfUser.mockReturnValue([hospital1, hospital2])

  clientEmployments.findLastEdit.mockImplementation(async () => ({}))

  // query without parameters
  nextRouter.useRouter.mockReturnValue({ ...mockRouterImplementation, query: {} })
  await waitFor(() => render(<EmploymentsPage currentUser={user} />))

  // We should go on list.
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).not.toBeInTheDocument()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(2)
})

it("should render error in employments page for regional people if query for an inaccessible hospital", async () => {
  const hospital1 = hospitalBuilder()
  const hospital2 = hospitalBuilder()
  const hospitalWithNoAcess = hospitalBuilder()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  scope.hospitalsOfUser.mockReturnValue([hospital1, hospital2])

  // Query explicitly set to the hospitalWithNoAcess id.
  nextRouter.useRouter.mockReturnValue({ ...mockRouterImplementation, query: { hid: [hospitalWithNoAcess.id] } })
  await waitFor(() => render(<EmploymentsPage currentUser={user} />))

  // We should go on error.
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).not.toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).not.toBeInTheDocument()

  expect(screen.queryByText(/Vous n'êtes pas autorisé à voir cet hôpital/i)).toBeInTheDocument()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(0)
})

it("should render the employments detail for regional people if query is correct", async () => {
  const hospital1 = hospitalBuilder()
  const hospital2 = hospitalBuilder()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  scope.hospitalsOfUser.mockReturnValue([hospital1, hospital2])

  // Query explicitly set to the hospital1 id.
  nextRouter.useRouter.mockReturnValue({ ...mockRouterImplementation, query: { hid: [hospital1.id] } })
  await waitFor(() => render(<EmploymentsPage currentUser={user} />))

  // We should go on detail page.
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).not.toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).toBeInTheDocument()

  expect(screen.queryByText(/Vous n'êtes pas autorisé à voir cet hôpital/i)).not.toBeInTheDocument()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(0)
})
