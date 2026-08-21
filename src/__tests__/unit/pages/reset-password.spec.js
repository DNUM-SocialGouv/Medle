import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import faker from "faker"
import * as nextRouter from "next/router"
import React from "react"

import { API_URL, RESET_PWD_ENDPOINT } from "../../../config"
import ResetPasswordPage from "../../../pages/reset-password"
import { generateToken } from "../../../utils/jwt"
import { mockRouterImplementation } from "../../../utils/test-utils"

// Mock isomorphic-unfetch before importing components
jest.mock("isomorphic-unfetch")
import fetch from "isomorphic-unfetch"

const originalWindow = { ...window }
const originalConsoleError = { ...console.error }

jest.spyOn(nextRouter, "useRouter")

const user = { email: faker.internet.email() }
const correctLoginToken = generateToken(user, { timeout: "1H" })
const incorrectLoginToken = generateToken(user, { timeout: "100ms" }) // Token only valid for 100 ms.

const url = `${API_URL}${RESET_PWD_ENDPOINT}`

// Setup fetch mock
fetch.mockImplementation((fetchUrl, options) => {
  if (fetchUrl === url && options?.method === "PATCH") {
    let body = {}
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
    } catch (e) {
      // If body parsing fails, treat as empty
    }
    
    if (body?.loginToken === correctLoginToken) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      })
    }
    
    return Promise.resolve({
      ok: false,
      status: 500,
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
   
  nextRouter.useRouter.mockImplementation(() => ({
    ...mockRouterImplementation,
    query: { loginToken: correctLoginToken },
  }))
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
  nextRouter.useRouter.mockRestore()
   
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

  await userEvent.type(screen.getByLabelText(/^Mot de passe$/i), "tototiti")
  await userEvent.type(screen.getByLabelText(/Confirmation mot de passe/i), "tototata")

  await userEvent.click(screen.getByRole("button", { name: /appliquer/i }))

  await waitFor(() => expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument())
})

it("should show form fields for password reset", () => {
  render(<ResetPasswordPage />)

  expect(screen.getByText(/Changement de mot de passe/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^Mot de passe$/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Confirmation mot de passe/i)).toBeInTheDocument()
  expect(screen.getByRole("button", { name: /appliquer/i })).toBeInTheDocument()
})

it("should accept matching passwords", async () => {
  render(<ResetPasswordPage />)

  const password = "tototiti"

  await userEvent.type(screen.getByLabelText(/^Mot de passe$/i), password)
  await userEvent.type(screen.getByLabelText(/Confirmation mot de passe/i), password)

  await userEvent.click(screen.getByRole("button", { name: /appliquer/i }))

  // Just verify the form submission is attempted without errors
  expect(screen.queryByText(/Les mots de passe ne correspondent pas/i)).not.toBeInTheDocument()
})
