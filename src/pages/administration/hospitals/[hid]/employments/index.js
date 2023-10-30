import AddIcon from "@material-ui/icons/Add"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { Container, Table } from "reactstrap"

import { findReferences } from "../../../../../clients/employments-references"
import { SearchButton } from "../../../../../components/form/SearchButton"
import Layout from "../../../../../components/Layout"
import { Title1, Title2 } from "../../../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../../../utils/auth"
import { NAME_MONTHS } from "../../../../../utils/date"
import { getReferenceData } from "../../../../../utils/init"
import { logError } from "../../../../../utils/logger"
import { ADMIN } from "../../../../../utils/roles"

const EmploymentsPage = ({ currentUser, references }) => {
  const router = useRouter()
  const [error] = useState("")

  const { hid } = router.query

  const [hospital] = getReferenceData("hospitals").filter((hospital) => hospital.id === Number(hid))

  return (
    <Layout page="hospitals" currentUser={currentUser} admin={true}>
      <Head>
        <title>Hôpital {hospital?.name} - Historique des ETP de référence - Medlé</title>
      </Head>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <div className="d-flex justify-content-between">
          <Link href="/administration/hospitals/[hid]" as={`/administration/hospitals/${hid}`}>
              <ArrowBackIosIcon width={30} style={{ width: 15 }} />
              Retour aux détails
          </Link>
        </div>
        <Title1>Hôpital {hospital?.name}</Title1>
        <Link
          href={`/administration/hospitals/[hid]/employments/[rid]`}
          as={`/administration/hospitals/${hid}/employments/new`}
        >
            <SearchButton className="btn-outline-primary">
              <AddIcon />
              &nbsp; Ajouter
            </SearchButton>
        </Link>
      </Container>

      <Container style={{ maxWidth: 980, minWidth: 740 }}>
        <Title2>Historique des ETP de référence</Title2>

        {!references?.length && (
          <div className="text-center mt-5">
            <span>
              <i>Aucun ETP de référence inscrit pour cet établissement.</i>
            </span>
          </div>
        )}

        {!error && !!references?.length && (
          <>
            <Table responsive className="table-hover">
              <thead>
                <tr className="table-light">
                  <th>Mois de début</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {references.map((reference) => (
                  <Link
                    key={reference.id}
                    href={`/administration/hospitals/[hid]/employments/[rid]`}
                    as={`/administration/hospitals/${hid}/employments/${reference.id}`}
                  >
                    <tr>
                      <td>
                        <b>{`${NAME_MONTHS[reference.month]}`}</b> <b>{`${reference.year}`}</b>
                      </td>
                      <td>
                        <Link
                          href={`/administration/hospitals/[hid]/employments/[rid]`}
                          as={`/administration/hospitals/${hid}/employments/${reference.id}`}
                            className="text-decoration-none"
                            aria-label={
                              "Voir ou modifier la référence " + NAME_MONTHS[reference.month] + " " + reference.year
                            }
                          >
                            Voir / Modifier
                        </Link>
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </Layout>
  )
}

EmploymentsPage.propTypes = {
  currentUser: PropTypes.object,
  references: PropTypes.array,
}

EmploymentsPage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  const { hid } = ctx.query

  try {
    const references = await findReferences({ hospitalId: hid, headers })
    return { references }
  } catch (error) {
    logError("APP error", error)

    redirectIfUnauthorized(error, ctx)
  }
  return {}
}

export default withAuthentication(EmploymentsPage, ADMIN)
