import React from "react"
import { Alert, Container } from "reactstrap"
import { Title1 } from "../components/StyledComponents"

const HealthCheckPage = () => {
  return (
    <Container style={{ maxWidth: 720 }}>
      <Title1 className="mt-5 mb-5">Page de diagnostic de Medlé</Title1>
      <Alert color="success" className="text-center">
        {"Everything is all right."}
      </Alert>
    </Container>
  )
}

export default HealthCheckPage
