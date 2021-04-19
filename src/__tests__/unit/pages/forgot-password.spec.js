import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import { rest } from "msw"
import { setupServer } from "msw/node"
import React from "react"

import { API_URL, FORGOT_PWD_ENDPOINT } from "../../../config"
import ForgotPasswordPage from "../../../pages/forgot-password"

const originalWindow = { ...window }
const originalConsoleError = { ...console.error }

const notFoundEmail = faker.internet.email()
const foundEmail = "xx" + notFoundEmail // Ensure to have consistently a different password than notFoundEmail.

const url = `${API_URL}${FORGOT_PWD_ENDPOINT}`

const server = setupServer(
  rest.post(url, (req, res, ctx) => {
    if (req.body?.email === notFoundEmail) {
      return res(ctx.status(404), ctx.json({ message: `User with email ${notFoundEmail} doesn't exist.`, status: 404 }))
    }
    return res(ctx.status(200), ctx.json({}))
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

it("should render ForgotPasswordPage", () => {
  render(<ForgotPasswordPage />)

  const title = screen.queryByText(/Vous avez oublié votre mot de passe/i)

  expect(title).toBeInTheDocument()
})

it("should show an error if no email is given", () => {
  render(<ForgotPasswordPage />)

  userEvent.type(screen.getByLabelText(/courriel/i), "")

  userEvent.click(screen.getByRole("button", { name: /envoyer un email/i }))

  expect(screen.getByRole("alert")).toHaveTextContent(/Veuillez renseigner le champ Courriel/i)
})

it("should render error if no user with this email is found in db", async () => {
  render(<ForgotPasswordPage />)

  userEvent.type(screen.getByLabelText(/courriel/i), notFoundEmail)

  userEvent.click(screen.getByRole("button", { name: /envoyer un email/i }))

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/Le courriel ne semble pas exister/i)
  })
})

it("should render correctly if user email is found", async () => {
  render(<ForgotPasswordPage />)

  userEvent.type(screen.getByLabelText(/courriel/i), foundEmail)

  userEvent.click(screen.getByRole("button", { name: /envoyer un email/i }))

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/Un courriel vous a été envoyé/i)
  })
})
