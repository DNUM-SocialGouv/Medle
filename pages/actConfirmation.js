import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { Container, Row } from "reactstrap"
import { Button, Title1 } from "../components/StyledComponents"
import Add from "@material-ui/icons/Add"

const ActConfirmationPage = () => {
   const router = useRouter()
   const { id, num_pv } = router.query

   return (
      <Layout>
         <Container>
            <Title1 className="mt-5">{`L'acte #${id} (PV: ${num_pv}) a été ajouté.`}</Title1>

            <Row className="mt-5">
               <Link href="/actDeclaration">
                  <Button className="mx-auto">
                     <Add /> Ajouter un nouvel acte
                  </Button>
               </Link>
            </Row>

            <Row className="mt-5">
               <Link href="/home">
                  <a className="mx-auto">Retour à la liste des examens</a>
               </Link>
            </Row>
         </Container>
      </Layout>
   )
}

export default ActConfirmationPage
