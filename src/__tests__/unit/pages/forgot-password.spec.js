import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import React from "react"

import { API_URL, FORGOT_PWD_ENDPOINT } from "../../../config"
import ForgotPasswordPage from "../../../pages/forgot-password"

// Mock isomorphic-unfetch before importing components
jest.mock("isomorphic-unfetch")
import fetch from "isomorphic-unfetch"

const originalWindow = { ...window }
const originalConsoleError = { ...console.error }

const notFoundEmail = faker.internet.email()
const foundEmail = "xx" + notFoundEmail // Ensure to have consistently a different password than notFoundEmail.

const url = `${API_URL}${FORGOT_PWD_ENDPOINT}`

// Setup fetch mock
fetch.mockImplementation((fetchUrl, options) => {
  if (fetchUrl === url && options?.method === "POST") {
    let body = {}
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
    } catch (e) {
      // If body parsing fails, treat as empty
    }
    
    if (body?.email === notFoundEmail) {
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: `User with email ${notFoundEmail} doesn't exist.`, status: 404 }),
      })
    }
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  }
  
  // Default response for other requests
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
})

beforeAll(() => {
  // Disable window._paq.push used by Matomo.
  if (!window?._paq?.push) {
    window._paq = {
      push: jest.fn(),
    }
  }
  console.error = () => {}
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
   
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

  await userEvent.type(screen.getByLabelText(/courriel/i), notFoundEmail)

  await userEvent.click(screen.getByRole("button", { name: /envoyer un email/i }))

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/Erreur lors de l'envoi du courriel/i)
  })
})

it("should render correctly if user email is found", async () => {
  render(<ForgotPasswordPage />)

  await userEvent.type(screen.getByLabelText(/courriel/i), foundEmail)

  await userEvent.click(screen.getByRole("button", { name: /envoyer un email/i }))

  await waitFor(() => {
    expect(screen.getByRole("alert")).toHaveTextContent(/Si votre identifiant est correct/i)
  })
})
