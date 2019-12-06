export class HTTPError extends Error {
   constructor(message, status) {
      super(message)
      this.name = "HTTPError"
      this.status = status
   }

   toString() {
      return `${this.name} : ${this.status} (${this.message})`
   }
}

export class ValidationError extends Error {
   constructor(message) {
      super(message)
      this.name = "ValidationError"
   }
}

export class DBError extends Error {
   constructor(message) {
      super(message)
      this.name = "DBError"
   }
}

export class APIError extends HTTPError {
   constructor(message, status) {
      super(message, status)
      this.name = "APIError"
   }
}

export const handleAPIResponse = async response => {
   if (!response.ok) {
      throw new APIError(response.statusText, response.status)
   }
   return response.json()
}
