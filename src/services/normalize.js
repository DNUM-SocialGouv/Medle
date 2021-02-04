import { APIError } from "../utils/errors"
import { STATUS_400_BAD_REQUEST } from "../utils/http"

// Validation with YUP of given parameters given to API endpoints
export const normalize = (yupSchema) => async (params) => {
  try {
    const value = await yupSchema.validate(params, { strict: false, abortEarly: false })
    return value
  } catch (error) {
    throw new APIError({
      status: STATUS_400_BAD_REQUEST,
      message: "Bad request",
      detail: error.inner && error.inner.map((err) => [err.path, err.message]),
    })
  }
}
