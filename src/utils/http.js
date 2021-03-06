export const STATUS_200_OK = 200
export const STATUS_201_CREATED = 201 // POST ou PUT envoyant une location dans le header
export const STATUS_202_ACCEPTED = 202 // ex: asynchrone
export const STATUS_204_NO_CONTENT = 204 // ex: delete
export const STATUS_206_PARTIAL_CONTENT = 206 // ex: pagination
export const STATUS_301_MOVE_PERMANENTLY = 301
export const STATUS_400_BAD_REQUEST = 400
export const STATUS_401_UNAUTHORIZED = 401
export const STATUS_403_FORBIDDEN = 403
export const STATUS_404_NOT_FOUND = 404
export const STATUS_405_METHOD_NOT_ALLOWED = 405
export const STATUS_406_NOT_ACCEPTABLE = 406 // pas de match avec le header Accept-*
export const STATUS_410_GONE = 410
export const STATUS_429_TOO_MANY_REQUESTS = 429
export const STATUS_500_INTERNAL_SERVER_ERROR = 500
export const STATUS_501_NOT_IMPLEMENTED = 501
export const STATUS_503_SERVICE_UNAVAILABLE = 503

export const METHOD_GET = "GET"
export const METHOD_POST = "POST"
export const METHOD_OPTIONS = "OPTIONS"
export const METHOD_PUT = "PUT"
export const METHOD_PATCH = "PATCH"
export const METHOD_DELETE = "DELETE"

export const CORS_ALLOW_ORIGIN = process.env.APP_BASE_URL || "*"
