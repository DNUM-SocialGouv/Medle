export const getLoginDelayConfig = () =>
  Number.isInteger(Number.parseInt(process.env.LOGIN_DELAY_ATTEMPTS)) &&
  Number.isInteger(Number.parseInt(process.env.LOGIN_DELAY_SECONDS))
    ? {
        attempts: Number.parseInt(process.env.LOGIN_DELAY_ATTEMPTS),
        seconds: Number.parseInt(process.env.LOGIN_DELAY_SECONDS),
      }
    : null
