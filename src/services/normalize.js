import { STATUS_400_BAD_REQUEST } from "../utils/http"
import { APIError } from "../utils/errors"

// Validation with YUP of given parameters given to API endpoints
export const normalize = (yupSchema) => async (params) => {
  try {
    const value = await yupSchema.validate(params, { strict: false })
    return value
  } catch (error) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
      detail: error.inner && error.inner.map((err) => [err.path, err.message]),
    })
  }
}
