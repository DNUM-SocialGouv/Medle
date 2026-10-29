import "@testing-library/jest-dom/extend-expect"

import { build, oneOf, perBuild, sequence } from "@jackfranklin/test-data-bot"
import { render, screen, waitFor } from "@testing-library/react"
import faker from "faker"
import * as nextRouter from "next/router"

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
    firstName: perBuild(() => faker.name.firstName()),
    hospital: {
      id: sequence(),
    },
    id: sequence(),
    lastName: perBuild(() => faker.name.lastName()),
    role: oneOf(EMPLOYMENT_CONSULTATION, SUPER_ADMIN, REGIONAL_SUPERVISOR, PUBLIC_SUPERVISOR),
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
    name: perBuild(() => faker.address.city()),
  },
})

const setupHospitals = () => {
  const hospital1 = hospitalBuilder()
  const hospital2 = hospitalBuilder()

  scope.hospitalsOfUser.mockReturnValue([hospital1, hospital2])

  return [hospital1, hospital2]
}

const renderEmploymentsPage = (user, query = {}) => {
  nextRouter.useRouter.mockReturnValue({ ...mockRouterImplementation, query })
  render(<EmploymentsPage currentUser={user} />)
}

const expectListView = () => {
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).not.toBeInTheDocument()
  expect(screen.queryByText(/Vous n'êtes pas autorisé à voir cet hôpital/i)).not.toBeInTheDocument()
}

const expectDetailView = () => {
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).not.toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).toBeInTheDocument()
  expect(screen.queryByText(/Vous n'êtes pas autorisé à voir cet hôpital/i)).not.toBeInTheDocument()
}

const expectErrorView = () => {
  expect(screen.queryByRole("heading", { name: /tous les établissements/i })).not.toBeInTheDocument()
  expect(screen.queryByRole("heading", { name: /déclaration du personnel/i })).not.toBeInTheDocument()
  expect(screen.queryByText(/Vous n'êtes pas autorisé à voir cet hôpital/i)).toBeInTheDocument()
}

it("should render employments page with list for ministere people", async () => {
  setupHospitals()

  const user = publicSupervisorBuilder()

  clientEmployments.findLastEdit.mockImplementation(async () => ({}))

  // query without parameters
  renderEmploymentsPage(user)

  // We should go on list.
  expectListView()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(2)
})

it("should render employments page with list for regional people if no query", async () => {
  const [hospital1, hospital2] = setupHospitals()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  clientEmployments.findLastEdit.mockImplementation(async () => ({}))

  // query without parameters
  renderEmploymentsPage(user)

  // We should go on list.
  expectListView()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(2)
})

it("should render error in employments page for regional people if query for an inaccessible hospital", async () => {
  const [hospital1, hospital2] = setupHospitals()
  const hospitalWithNoAcess = hospitalBuilder()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  // Query explicitly set to the hospitalWithNoAcess id.
  renderEmploymentsPage(user, { hid: [hospitalWithNoAcess.id] })

  // We should go on error.
  expectErrorView()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(0)
})

it("should render the employments detail for regional people if query is correct", async () => {
  const [hospital1, hospital2] = setupHospitals()

  const user = regionalSupervisorBuilder({
    scope: [hospital1.id, hospital2.id],
  })

  // Query explicitly set to the hospital1 id.
  renderEmploymentsPage(user, { hid: [hospital1.id] })

  // We should go on detail page.
  expectDetailView()

  expect(clientEmployments.findLastEdit).toHaveBeenCalledTimes(0)
})
