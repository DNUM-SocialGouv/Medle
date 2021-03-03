import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import React from "react"

import Login from "../../../components/Login"
import * as nextRouter from "next/router"

import { mockRouterImplementation } from "../../../utils/test-utils"

// Keep the standard router at hand in order to not interfere with other tests.
const defaultRouter = nextRouter.useRouter

beforeAll(() => {
  /* eslint-disable no-import-assign*/
  nextRouter.useRouter = jest.fn(() => mockRouterImplementation)
})

afterAll(() => {
  nextRouter.useRouter = defaultRouter
})

afterEach(cleanup)

describe("<Login> component tests", () => {

  it("should display a spinner in case of loading authentication process", async () => {
    const noop = jest.fn()

    render(<Login authentication={noop} error={null} />)

    userEvent.click(screen.getByText("Se connecter"))

    await screen.findByTestId("loading")

    expect(noop).toHaveBeenCalledTimes(1)

  })

  it("should display an error in case of loading authentication issue", async () => {
    const noop = jest.fn()

    render(<Login authentication={noop} error={"Erreur_xxx"} />)

    userEvent.click(screen.getByText("Se connecter"))

    await screen.findByTestId("loading")

    expect(noop).toHaveBeenCalledTimes(1)

    await screen.findByText("Erreur_xxx")
  })
})
