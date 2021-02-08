export const preventDefault = (callback) => (event) => {
  event.preventDefault()
  callback(event)
}
