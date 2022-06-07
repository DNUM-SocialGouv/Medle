import Head from "next/head"
import { useRouter } from "next/router"
import { PropTypes } from "prop-types"
import React from "react"
import { useForm } from "react-hook-form"
import { Button, Container, Form, FormFeedback, Input, Label } from "reactstrap"

import { updateFooterDocument } from "../../../clients/footer-documents"
import Layout from "../../../components/Layout"
import StatusAlert from "../../../components/StatusAlert"
import { Title1 } from "../../../components/StyledComponents"
import { withAuthentication } from "../../../utils/auth"
import {
  footerDocumentAccessibilite,
  footerDocumentDonneesPersonnelles,
  footerDocumentFAQ,
  footerDocumentGestionCookies,
  footerDocumentMentionsLegales,
} from "../../../utils/documentsConstants"
import { isEmpty } from "../../../utils/misc"
import { ADMIN } from "../../../utils/roles"

const messageStatusError = "Erreur lors de l'enregistrement du document."

const AdminFooterLinkPage = ({ currentUser }) => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
  } = useForm()
  const [status, setStatus] = React.useState({ type: "idle" })

  const { ref: footerDocumentAccessibiliteRef, ...footerDocumentAccessibiliteReg } =
    register("footerDocumentAccessibilite")

  const { ref: footerDocumentMentionsLegalesRef, ...footerDocumentMentionsLegalesReg } = register(
    "footerDocumentMentionsLegales",
  )

  const { ref: footerDocumentDonneesPersonnellesRef, ...footerDocumentDonneesPersonnellesReg } = register(
    "footerDocumentDonneesPersonnelles",
  )

  const { ref: footerDocumentGestionCookiesRef, ...footerDocumentGestionCookiesReg } =
    register("footerDocumentGestionCookies")

  const { ref: footerDocumentFAQRef, ...footerDocumentFAQReg } = register("footerDocumentFAQ")

  const onSubmitFooterDocumentAccessibilite = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateFooterDocument({ footerDocument: data.footerDocumentAccessibilite[0] }, footerDocumentAccessibilite)
        setStatus({ message: "Document Accessibilité mis à jour.", type: "success" })
      }
    } catch (error) {
      console.error(`Error when trying to change document`, error)
      setStatus({ message: messageStatusError, type: "error" })
    }
  }

  const onSubmitFooterDocumentMentionsLegales = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateFooterDocument(
          { footerDocument: data.footerDocumentMentionsLegales[0] },
          footerDocumentMentionsLegales,
        )
        setStatus({ message: "Document Mentions légales mis à jour.", type: "success" })
      }
    } catch (error) {
      console.error(`Error when trying to change document`, error)
      setStatus({ message: messageStatusError, type: "error" })
    }
  }

  const onSubmitFooterDocumentDonneesPersonnelles = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateFooterDocument(
          { footerDocument: data.footerDocumentDonneesPersonnelles[0] },
          footerDocumentDonneesPersonnelles,
        )
        setStatus({ message: "Document Données personnelles mis à jour.", type: "success" })
      }
    } catch (error) {
      console.error(`Error when trying to change document`, error)
      setStatus({ message: messageStatusError, type: "error" })
    }
  }

  const onSubmitFooterDocumentGestionCookies = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateFooterDocument(
          { footerDocument: data.footerDocumentGestionCookies[0] },
          footerDocumentGestionCookies,
        )
        setStatus({ message: "Document Gestion des cookies mis à jour.", type: "success" })
      }
    } catch (error) {
      console.error(`Error when trying to change document`, error)
      setStatus({ message: messageStatusError, type: "error" })
    }
  }

  const onSubmitFooterDocumentFAQ = async (data) => {
    setStatus({ type: "pending" })
    try {
      if (isEmpty(formErrors)) {
        await updateFooterDocument({ footerDocument: data.footerDocumentFAQ[0] }, footerDocumentFAQ)
        setStatus({ message: "Document FAQ mis à jour.", type: "success" })
      }
    } catch (error) {
      console.error(`Error when trying to change document`, error)
      setStatus({ message: messageStatusError, type: "error" })
    }
  }

  return (
    <Layout page="footer-documents" currentUser={currentUser} admin={true}>
      <Head>
        <title>Administration des documents du pied de page - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des documents du pied de page"}</Title1>
      </Container>
      <Container>
        {status?.message && <StatusAlert {...status} />}

        <Form onSubmit={handleSubmit(onSubmitFooterDocumentAccessibilite)}>
          <div className="align-items-baseline row">
            <Label for={footerDocumentAccessibilite} className="col-sm-4">
              Accessibilité :
            </Label>
            <Input
              type="file"
              accept="application/pdf"
              {...footerDocumentAccessibiliteReg}
              innerRef={footerDocumentAccessibiliteRef}
              invalid={!!formErrors.footerDocumentAccessibilite}
              name={footerDocumentAccessibilite}
              id={footerDocumentAccessibilite}
              className="col-sm-4"
            />
            <FormFeedback>{formErrors.footerDocumentAccessibilite && "Un document est requis."}</FormFeedback>
            <Button
              className="px-4 mt-5 col-sm-4"
              color="primary"
              onClick={handleSubmit(onSubmitFooterDocumentAccessibilite)}
            >
              {"Valider document 'Accessibilité'"}
            </Button>
          </div>
        </Form>

        <Form onSubmit={handleSubmit(onSubmitFooterDocumentMentionsLegales)} className="align-items-baseline row">
          <Label for={footerDocumentMentionsLegales} className="col-sm-4">
            Mentions légales :
          </Label>
          <Input
            type="file"
            accept="application/pdf"
            {...footerDocumentMentionsLegalesReg}
            innerRef={footerDocumentMentionsLegalesRef}
            invalid={!!formErrors.footerDocumentMentionsLegales}
            name={footerDocumentMentionsLegales}
            id={footerDocumentMentionsLegales}
            className="col-sm-4"
          />
          <FormFeedback>{formErrors.footerDocumentMentionsLegales && "Un document est requis."}</FormFeedback>
          <Button
            className="px-4 mt-5 col-sm-4"
            color="primary"
            onClick={handleSubmit(onSubmitFooterDocumentMentionsLegales)}
          >
            {"Valider document 'Mentions légales'"}
          </Button>
        </Form>

        <Form onSubmit={handleSubmit(onSubmitFooterDocumentDonneesPersonnelles)} className="align-items-baseline row">
          <Label for={footerDocumentDonneesPersonnelles} className="col-sm-4">
            Données personnelles :
          </Label>
          <Input
            type="file"
            accept="application/pdf"
            {...footerDocumentDonneesPersonnellesReg}
            innerRef={footerDocumentDonneesPersonnellesRef}
            invalid={!!formErrors.footerDocumentDonneesPersonnelles}
            name={footerDocumentDonneesPersonnelles}
            id={footerDocumentDonneesPersonnelles}
            className="col-sm-4"
          />
          <FormFeedback>{formErrors.footerDocumentDonneesPersonnelles && "Un document est requis."}</FormFeedback>
          <Button
            className="px-4 mt-5 col-sm-4"
            color="primary"
            onClick={handleSubmit(onSubmitFooterDocumentDonneesPersonnelles)}
          >
            {"Valider document 'Données personnelles'"}
          </Button>
        </Form>

        <Form onSubmit={handleSubmit(onSubmitFooterDocumentGestionCookies)} className="align-items-baseline row">
          <Label for={footerDocumentGestionCookies} className="col-sm-4">
            Gestion des cookies :
          </Label>
          <Input
            type="file"
            accept="application/pdf"
            {...footerDocumentGestionCookiesReg}
            innerRef={footerDocumentGestionCookiesRef}
            invalid={!!formErrors.footerDocumentGestionCookies}
            name={footerDocumentGestionCookies}
            id={footerDocumentGestionCookies}
            className="col-sm-4"
          />
          <FormFeedback>{formErrors.footerDocumentGestionCookies && "Un document est requis."}</FormFeedback>
          <Button
            className="px-4 mt-5 col-sm-4"
            color="primary"
            onClick={handleSubmit(onSubmitFooterDocumentGestionCookies)}
          >
            {"Valider document 'Gestion des cookies'"}
          </Button>
        </Form>

        <Form onSubmit={handleSubmit(onSubmitFooterDocumentFAQ)} className="align-items-baseline row">
          <Label for={footerDocumentFAQ} className="col-sm-4">
            Foire aux questions :
          </Label>
          <Input
            type="file"
            accept="application/pdf"
            {...footerDocumentFAQReg}
            innerRef={footerDocumentFAQRef}
            invalid={!!formErrors.footerDocumentFAQ}
            name={footerDocumentFAQ}
            id={footerDocumentFAQ}
            className="col-sm-4"
          />
          <FormFeedback>{formErrors.footerDocumentFAQ && "Un document est requis."}</FormFeedback>
          <Button className="px-4 mt-5 col-sm-4" color="primary" onClick={handleSubmit(onSubmitFooterDocumentFAQ)}>
            {"Valider document 'Foire aux questions'"}
          </Button>
        </Form>
      </Container>
    </Layout>
  )
}

AdminFooterLinkPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  footerDocumentAccessibilite: PropTypes.object,
  footerDocumentMentionsLegales: PropTypes.object,
  footerDocumentDonneesPersonnelles: PropTypes.object,
  footerDocumentGestionCookies: PropTypes.object,
  footerDocumentFAQ: PropTypes.object,
}
AdminFooterLinkPage.getInitialProps = async () => {
  return {}
}
export default withAuthentication(AdminFooterLinkPage, ADMIN)
