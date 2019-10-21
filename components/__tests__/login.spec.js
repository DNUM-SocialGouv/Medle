import React from "react"
import { cleanup, render, fireEvent, waitForElement } from "@testing-library/react"
import Login from "../login"
import { act } from "react-dom/test-utils"

describe("<Login> component tests", () => {
   afterEach(cleanup)

   //    beforeEach(() => {
   //       console.log("dans le beforeEach")
   //    })

   it("should display a spinner in case of loading authentication process", async () => {
      const fn = jest.fn(() => {
         setTimeout(() => {
            // something
         })
      }, 100)

      const { getByText, getByTestId } = render(<Login authentication={fn} error={null} />)

      fireEvent.click(getByText("Se connecter"))

      expect(fn).toHaveBeenCalledTimes(1)

      expect(getByTestId("loading")).toBeTruthy()
   })

   it.skip("should display an error in case of loading authentication issue", async () => {
      const fn = jest.fn(() => {
         return Promise.reject("Erreur xxx")
      })

      const { getByText, findByText, getByTestId, queryByTestId } = render(<Login authentication={fn} error={null} />)

      fireEvent.click(getByText("Se connecter"))

      expect(fn).toHaveBeenCalledTimes(1)

      expect(getByTestId("loading")).not.toBeNull()

      let erreurDiv

      await waitForElement(() => {
         erreurDiv = findByText("Erreur xxx")
      })

      expect(erreurDiv).not.toBeTruthy()

      expect(queryByTestId("loading")).toBeNull()
   })
})
