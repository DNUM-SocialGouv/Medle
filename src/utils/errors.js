export class HTTPError extends Error {
   constructor(message) {
      super(message)
      this.name = "HTTPError"
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

export class APIError extends Error {
   constructor(message) {
      super(message)
      this.name = "APIError"
   }
}

export const handleAPIResponse = async response => {
   if (!response.ok) {
      throw new APIError(`${response.statusText} (${response.status})`)
   }
   return response.json()
}

async function test() {
   let response, json
   try {
      response = await fetch(API_URL)
      json = handleAPIResponse(response)
   } catch (error) {
      console.error(error)
   }
}
