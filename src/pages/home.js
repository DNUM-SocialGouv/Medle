import React from "react"
import Layout from "../components/Layout"
import Banner from "../components/Banner"
import Link from "next/link"
import { Button, Card, CardText, CardTitle, Col, Container, Row } from "reactstrap"

const Home = () => (
   <Layout>
      <Banner title="Liste des fonctionnalités" />
      <Container>
         <Row>
            <Col sm="4">
               <Card body>
                  <CardTitle>
                     <h4>{"Déclaration acte"}</h4>
                  </CardTitle>
                  <CardText>
                     {"Déclarer ses actes de médecine légale en tant qu'établissement de santé (UMJ ou IML)."}
                  </CardText>
                  <Link href="/actDeclaration">
                     <Button>Déclarer un acte</Button>
                  </Link>
               </Card>
            </Col>
            <Col sm="4">
               <Card body>
                  <CardTitle>
                     <h4>Voir et éditer ses actes</h4>
                  </CardTitle>
                  <CardText>{"Voir et modifier les actes passés pour mon établissement de santé."}</CardText>
                  <Link href="/actsList">
                     <Button>Voir les actes</Button>
                  </Link>
               </Card>
            </Col>
            <Col sm="4">
               <Card body>
                  <CardTitle>
                     <h4>ETP</h4>
                  </CardTitle>
                  <CardText>{"Renseigner les emplois temps plein de son établissement de santé par mois"}.</CardText>
                  <Link href="/fillEmployments">
                     <Button>Voir et renseigner mes ETP</Button>
                  </Link>
               </Card>
            </Col>
         </Row>
         <Row className="mt-4">
            <Col sm="4">
               <Card body>
                  <CardTitle>
                     <h4>{"Profil"}</h4>
                  </CardTitle>
                  <CardText>{"Voir le profil de mon établissement de santé."}</CardText>
                  <Link href="/home">
                     <Button>Voir mon profil</Button>
                  </Link>
               </Card>
            </Col>
            <Col sm="4">
               <Card body>
                  <CardTitle>
                     <h4>Statistiques</h4>
                  </CardTitle>
                  <CardText>
                     {"Voir les différentes statistiques de son établissement et des statistiques générales."}
                  </CardText>
                  <Link href="/home">
                     <Button>Voir les statistiques</Button>
                  </Link>
               </Card>
            </Col>
         </Row>
      </Container>
   </Layout>
)

export default Home
