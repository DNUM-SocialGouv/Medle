// Caveat : extends the Error API in JS doesn't allow to easily get message or stack trace which are not serializable by default.
// https://stackoverflow.com/a/26199752/2728710 explains how to use it but it's too overkill anyway so let's use our own object to carry error
class MedleError {
   constructor({ message, detailMessage, uri }) {
      this.name = this.constructor.name
      this.message = message
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
