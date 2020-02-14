class MedleError extends Error {
   constructor({ message, detailMessage, uri }) {
      super(message)
      this.name = this.constructor.name
      this.detailMessage = detailMessage
      this.uri = uri
   }
}

export class APIError extends MedleError {
   constructor({ message, status, detailMessage, uri }) {
      super({ message, detailMessage, uri })
      this.name = this.constructor.name
      this.status = status
   }
}

export class ValidationError extends MedleError {
   constructor(message, detailMessage) {
      super({ message, detailMessage })
      this.name = this.constructor.name
   }
}

export const handleAPIResponse = async response => {
   if (!response.ok) {
      try {
         const { name, message, status, detailMessage, uri } = await response.json()
         throw new APIError({ name, message, status, detailMessage, uri })
      } catch (error) {
         throw new APIError({ message: response.statusText, status: response.status })
      }
   }
   return response.json()
}

export const stringifyError = error => {
   // eslint-disable-next-line no-unused-vars
   const [stack, ...keys] = Object.getOwnPropertyNames(error)
   return JSON.stringify(error, keys, " ")
}
