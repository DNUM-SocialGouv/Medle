import React from "react"
import { PropTypes } from "prop-types"
import Layout from "../components/Layout"
import { Container } from "reactstrap"
import { Title1, Title2 } from "../components/StyledComponents"
import { withAuthentication } from "../utils/auth"

const Section = ({ title }) => (
   <Title2 className="border-bottom text-left text-capitalize font-weight-bold">{title}</Title2>
)
const Question = ({ title }) => <Title2 className="mb-3 mt-5 text-left text-info">{title}</Title2>
const Answer = ({ children }) => <p dangerouslySetInnerHTML={{ __html: children }} />

Section.propTypes = {
   title: PropTypes.string.isRequired,
}
Question.propTypes = {
   title: PropTypes.string.isRequired,
}
Answer.propTypes = {
   children: PropTypes.array,
}

const FaqPage = ({ currentUser }) => {
   return (
      <Layout currentUser={currentUser}>
         <Container style={{ maxWidth: 720 }}>
            <Title1 className="mt-5 mb-5">Foire aux questions</Title1>

            <Section title="Utiliser le produit" />

            <Question title="Comment me créer un compte ?" />
            <Answer>
               {`Pour toute demande de création de compte, merci d'effectuer une demande par email à l'adresse
               <a href="mailto:contact.medle@fabrique.social.gouv.fr">contact.medle@fabrique.social.gouv.fr</a>
               .&nbsp;
               Il est préférable de préciser l'établissement auquel vous êtes rattaché, votre adresse email (qui vous servira d'identifiant) et l'objet de votre utilisation : déclaration des actes, déclaration des ETP,...`}
            </Answer>

            <Question title="Qui peut être administrateur de la structure ?" />
            <Answer>{`Généralement le responsable de la structure UMJ/IML.`}</Answer>

            <Question title="Comment supprimer un compte utilisateur ?" />
            <Answer>
               {`Pour toute suppression de compte, merci d'effectuer une demande par email à l'adresse contact.medle@fabrique.social.gouv.fr. Afin de gagner du temps, vous pouvez préciser votre identifiant (adresse email), votre nom et votre prénom.`}
            </Answer>

            <Question title="Quels types d'actes peut-on recenser ?" />
            <Answer>
               {`En fonction du type de personne examinée (Victime =vivante, Gardé.e à vue, Personne pour âge osseux (hors GAV), Examen pour OFPRA, Personne décédée, Autre), vous allez pouvoir déclarer les actes suivants :
               <ul>
                  <li>Somatique / Psychiatrique</li>
                  <li>Scanner / Radiographie / Panoramique dentaire</li>
                  <li>Examen externe / Levée de corps / Autopsie / Anthropologie / Odontologie</li>
               </ul>
               `}
            </Answer>

            <Question title="Peut-on supprimer ou modifier un acte ?" />

            <Answer>
               {`Oui, pour cela, vous devez :

               <ul>
                    <li>Accéder à la liste des actes (menu "tous les actes" dans la colonne de gauche)</li>
                    <li>Retrouver l'acte que vous souhaitez supprimer ou modifier (vous avez la fonction recherche en haut de page)</li>
                    <li>Cliquer sur le lien "voir"</li>
                </ul>

                Vous arriverez sur le détail de l'acte en question, vous pourrez ensuite :
                <ul>
                    <li>Cliquer sur le bouton "supprimer"</li>
                    <li>Cliquer sur le bouton "modifier"</li>
                </ul>
                `}
            </Answer>
         </Container>
      </Layout>
   )
}

FaqPage.propTypes = {
   currentUser: PropTypes.object.isRequired,
}

export default withAuthentication(FaqPage, null, { redirect: false })
