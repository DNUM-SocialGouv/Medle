import getConfig from "next/config"

import { APIError, InternalError, stringifyError } from "../utils/errors"
import {
  STATUS_400_BAD_REQUEST,
  STATUS_403_FORBIDDEN,
  STATUS_404_NOT_FOUND,
  STATUS_405_METHOD_NOT_ALLOWED,
  STATUS_500_INTERNAL_SERVER_ERROR,
} from "../utils/http"
import { logError } from "../utils/logger"

const { publicRuntimeConfig } = getConfig() || {}

export const sendAPIError = (error, res) => {
  logError(error)

  if (error instanceof APIError) {
    return res.status(error.status).json(stringifyError(error))
  }

  // fallback error
  return res.status(STATUS_500_INTERNAL_SERVER_ERROR).json(
    stringifyError(
      new InternalError({
        detail:
          publicRuntimeConfig && publicRuntimeConfig.DEBUG_MODE && publicRuntimeConfig.DEBUG_MODE === "true"
            ? error.message
            : "Internal server error",
      }),
    ),
  )
}

export const sendMethodNotAllowedError = (res) =>
  sendAPIError(
    new APIError({
      status: STATUS_405_METHOD_NOT_ALLOWED,
      message: "Method not allowed",
    }),
    res,
  )

export const sendNotFoundError = (res) =>
  sendAPIError(
    new APIError({
      status: STATUS_404_NOT_FOUND,
      message: "Resource not found",
    }),
    res,
  )

export const sendForbiddenError = (res) =>
  sendAPIError(
    new APIError({
      status: STATUS_403_FORBIDDEN,
      message: "Forbidden",
    }),
    res,
  )

export const sendBadRequestError = (res) =>
  sendAPIError(
    new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
    }),
    res,
  )
