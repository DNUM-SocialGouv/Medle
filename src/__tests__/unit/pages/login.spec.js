import "@testing-library/jest-dom/extend-expect"

import { render, screen } from "@testing-library/react"
import React from "react"

import LoginPage from "../../../pages/index"

test("it should display alerts", async () => {
    render(<LoginPage message="Session terminée" welcomeMessage={"Les ETP sont à remplir avant le mois de mars."} />)

    expect(screen.getAllByRole("alert")).toMatchInlineSnapshot(`
        Array [
          <div
            class="alert alert-warning alert-dismissible w-100 mx-5 mt-3 mb-0 mb-md-5 py-3 overflow-auto false"
            role="alert"
            style="max-height: 200px;"
          >
            <div
              class="mb-2"
            />
            <div
              class="text-justify"
            >
              Les ETP sont à remplir avant le mois de mars.
              <button
                aria-label="Close"
                class="close"
                data-dismiss="alert"
                type="button"
              >
                <span
                  aria-hidden="true"
                >
                  ×
                </span>
              </button>
            </div>
          </div>,
          <div
            class="mt-3 mb-0 alert alert-danger"
            role="alert"
          >
            Session terminée
          </div>,
        ]
    `)
})

test("it should not display alerts with no props", async () => {
    render(<LoginPage />)

    expect(screen.queryAllByRole("alert")).toMatchInlineSnapshot(`Array []`)
})
