import { render, screen, waitFor } from "@testing-library/react"
import React from "react"

import * as clientsEmployment from "../../../clients/employments"
import * as clientsReference from "../../../clients/employments-references"
import { CurrentMonthEmployments } from "../../../components/EmploymentMonthData"
import * as auth from "../../../utils/auth"
import { SUPER_ADMIN } from "../../../utils/roles"

jest.spyOn(auth, "getCurrentUser")
jest.spyOn(clientsEmployment, "findEmployment")
jest.spyOn(clientsReference, "searchReferenceForMonth")

const lambdaUser = {
  hospital: { id: 3 },
  id: 3,
  role: SUPER_ADMIN,
}

const lambdaEmployments = {
  auditoriumAgents: "1",
  doctors: "11.9",
  executives: "1",
  ides: "3.3",
  nursings: "4.15",
  others: "2",
  secretaries: "1.9",
}

const lambdaReferences = {
  reference: {
    auditoriumAgents: "1",
    doctors: "0",
    executives: "0",
    ides: "0.5",
    nursings: "0",
    others: "1.5",
    secretaries: "0",
  },
}

const lambdaMonth = "03"
const lambdaYear = 2021
const lambdaHospitalId = 3

beforeEach(() => {
  auth.getCurrentUser.mockImplementation(async () => lambdaUser)
  clientsEmployment.findEmployment.mockImplementation(async () => lambdaEmployments)
  clientsReference.searchReferenceForMonth.mockImplementation(async () => lambdaReferences)
})

afterEach(() => {
  auth.getCurrentUser.mockRestore()
  clientsEmployment.findEmployment.mockRestore()
  clientsReference.searchReferenceForMonth.mockRestore()
})

it("should render CurrentMonthEmployments", async () => {
  await waitFor(() =>
    render(<CurrentMonthEmployments month={lambdaMonth} year={lambdaYear} hospitalId={lambdaHospitalId} />),
  )

  expect(screen.getByLabelText(/secrétaire/i)).toHaveValue(1.9)
  expect(screen.getByLabelText(/reference.others/i).textContent).toMatchInlineSnapshot(`"1.5 ETP prévus"`)

  expect(auth.getCurrentUser).toHaveBeenCalled()
  expect(clientsEmployment.findEmployment).toHaveBeenCalled()
  expect(clientsReference.searchReferenceForMonth).toHaveBeenCalled()
})
