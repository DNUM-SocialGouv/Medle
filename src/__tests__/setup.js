
// Mock next/config pour fournir publicRuntimeConfig dans les tests
jest.mock("next/config", () => ({
  __esModule: true,
  default: () => ({
    publicRuntimeConfig: {
      AUTH_DURATION: "1800",
      AUTH_REFRESH_START: "1500",
      AUTH_MAX_DURATION: "18000",
      API_URL: "http://localhost:3000/api",
      FEATURE_FLAGS: {},
    },
  }),
}))

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

