import nextConfig from "eslint-config-next"

const config = [
  {
    ignores: ["**/02_askers.js"],
  },
  ...nextConfig,
  {
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
]

export default config