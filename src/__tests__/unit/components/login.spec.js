import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import React from "react"

import Login from "../../../components/Login"
import * as nextRouter from "next/router"

import { mockRouterImplmentation } from "../../../utils/test-utils"

// Keep the standard router at hand in order to not interfere with other tests.
const defaultRouter = nextRouter.useRouter

describe("<Login> component tests", () => {
  beforeAll(() => {
    /* eslint-disable no-import-assign*/
    nextRouter.useRouter = jest.fn()
    nextRouter.useRouter.mockImplementation(() => mockRouterImplmentation)
  })

  afterAll(() => {
    nextRouter.useRouter = defaultRouter
  })

  afterEach(cleanup)

  it("should display a spinner in case of loading authentication process", async () => {
    const noop = jest.fn(() => { })

    const { getByText, getByTestId } = render(<Login authentication={noop} error={null} />)

    fireEvent.click(getByText("Se connecter"))

    const loading = await waitFor(() => getByTestId("loading"))

    expect(noop).toHaveBeenCalledTimes(1)

    expect(loading).toBeTruthy()
  })

  it("should display an error in case of loading authentication issue", async () => {
    const noop = jest.fn(() => { })

    const { getByText, findByText, getByTestId } = render(<Login authentication={noop} error={"Erreur_xxx"} />)

    fireEvent.click(getByText("Se connecter"))

    const loading = await waitFor(() => getByTestId("loading"))

    expect(noop).toHaveBeenCalledTimes(1)

    expect(loading).toBeTruthy()

    const erreurDiv = await waitFor(() => findByText("Erreur_xxx"))

    expect(erreurDiv).toBeTruthy()
  })
})
