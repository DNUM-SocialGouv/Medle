import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import { rest } from "msw"
import { setupServer } from "msw/node"
import * as nextRouter from "next/router"
import React from "react"

import { API_URL, RESET_PWD_ENDPOINT } from "../../../config"
import ResetPasswordPage from "../../../pages/reset-password"
import { generateToken } from "../../../utils/jwt"
import { mockRouterImplementation } from "../../../utils/test-utils"

const originalWindow = { ...window }
const originalConsoleError = { ...console.error }

jest.spyOn(nextRouter, "useRouter")

const user = { email: faker.internet.email() }
const correctLoginToken = generateToken(user, { timeout: "1H" })
const incorrectLoginToken = generateToken(user, { timeout: "100ms" }) // Token only valid for 100 ms.

beforeAll(() => {
  /* eslint-disable no-import-assign*/
  nextRouter.useRouter.mockImplementation(() => ({
    ...mockRouterImplementation,
    query: { loginToken: correctLoginToken },
  }))
})

afterAll(() => {
  nextRouter.useRouter.mockRestore()
})

const url = `${API_URL}${RESET_PWD_ENDPOINT}`

const server = setupServer(
  rest.patch(url, (req, res, ctx) => {
    if (req.body?.loginToken === correctLoginToken) {
      return res(ctx.status(200), ctx.json({}))
    }
    return res(ctx.status(500))
  }),
)

beforeAll(() => {
  server.listen()
  // Disable window._paq.push used by Matomo.
  if (!window?._paq?.push) {
    window._paq = {
      push: jest.fn(),
    }
  }
  console.error = () => {}
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})

afterAll(() => {
  server.close()
  // eslint-disable-next-line no-global-assign
  window = originalWindow
  console.error = originalConsoleError
})

it("should render ResetPasswordPage", () => {
  render(<ResetPasswordPage />)

  const title = screen.queryByText(/Changement de mot de passe/i)

  expect(title).toBeInTheDocument()
})

it("should show an error if no email is given", async () => {
  render(<ResetPasswordPage />)

  userEvent.type(screen.getByLabelText(/^Mot de passe$/i), "tototiti")
  userEvent.type(screen.getByLabelText(/Confirmation mot de passe/i), "tototata")

  userEvent.click(screen.getByRole("button", { name: /appliquer/i }))

  await waitFor(() => expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument())
})

it("should works for correct token", async () => {
  nextRouter.useRouter.mockImplementation(() => ({
    ...mockRouterImplementation,
    query: { loginToken: correctLoginToken },
  }))

  render(<ResetPasswordPage />)

  const password = "tototiti"

  userEvent.type(screen.getByLabelText(/^Mot de passe$/i), password)
  userEvent.type(screen.getByLabelText(/Confirmation mot de passe/i), password)

  userEvent.click(screen.getByRole("button", { name: /appliquer/i }))

  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Mot de passe réinitialisé/i))
})

it("should display an error  for incorrect token", async () => {
  nextRouter.useRouter.mockImplementation(() => ({
    ...mockRouterImplementation,
    query: { loginToken: incorrectLoginToken },
  }))

  render(<ResetPasswordPage />)

  const password = "tototiti"

  userEvent.type(screen.getByLabelText(/^Mot de passe$/i), password)
  userEvent.type(screen.getByLabelText(/Confirmation mot de passe/i), password)

  userEvent.click(screen.getByRole("button", { name: /appliquer/i }))

  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Erreur serveur/i))
})
