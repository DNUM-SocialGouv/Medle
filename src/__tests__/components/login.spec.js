import React from "react"
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react"
import Login from "../../components/Login"

describe("<Login> component tests", () => {
  afterEach(cleanup)

  it("should display a spinner in case of loading authentication process", async () => {
    const noop = jest.fn(() => {})

    const { getByText, getByTestId } = render(<Login authentication={noop} error={null} />)

    fireEvent.click(getByText("Se connecter"))

    const loading = await waitFor(() => getByTestId("loading"))

    expect(noop).toHaveBeenCalledTimes(1)

    expect(loading).toBeTruthy()
  })

  it("should display an error in case of loading authentication issue", async () => {
    const noop = jest.fn(() => {})

    const { getByText, findByText, getByTestId } = render(<Login authentication={noop} error={"Erreur_xxx"} />)

    fireEvent.click(getByText("Se connecter"))

    const loading = await waitFor(() => getByTestId("loading"))

    expect(noop).toHaveBeenCalledTimes(1)

    expect(loading).toBeTruthy()

    const erreurDiv = await waitFor(() => findByText("Erreur_xxx"))

    expect(erreurDiv).toBeTruthy()
  })
})
