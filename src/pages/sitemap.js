import Head from "next/head"
import React from "react"

import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import { isOpenFeature } from "../config"
import { useUser } from "../hooks/useUser"
import {
  ACT_CONSULTATION,
  ACT_MANAGEMENT,
  ADMIN,
  ADMIN_HOSPITAL,
  EMPLOYMENT_CONSULTATION,
  isAllowed,
  SUPER_ADMIN,
} from "../utils/roles"
import Link from "next/link"

const SiteMapPage = () => {
  const currentUser = useUser()

  return (
    <>
      <Layout page="sitemap" currentUser={currentUser}>
        <Head>
          <title>Plan du site - Medlé</title>
        </Head>
        <Title1 className="mt-5 mb-4">Plan du site</Title1>

        <div className="sitemapPage mt-5">
          <ul>
            <li>
              <Link href="/">Connexion</Link>
            </li>
            <li>
              <Link href="/forgot-password">Mot de passe oublié</Link>
            </li>
            {currentUser &&
              !currentUser.resetPassword &&
              isAllowed(currentUser.role, ACT_MANAGEMENT) &&
              currentUser.role !== SUPER_ADMIN && (
                <li>
                  <Link href="/acts/declaration">Ajout d&apos;acte</Link>
                </li>
              )}
            {currentUser && !currentUser.resetPassword && isAllowed(currentUser.role, ACT_CONSULTATION) && (
              <li>
                <Link href="/acts">Tous les actes</Link>
              </li>
            )}
            {currentUser && !currentUser.resetPassword && isAllowed(currentUser.role, EMPLOYMENT_CONSULTATION) && (
              <li>
                <Link href="/employments">Personnel</Link>
              </li>
            )}
            {currentUser && !currentUser.resetPassword && (
              <li>
                <Link href="/statistics">Statistiques</Link>
              </li>
            )}
            {currentUser &&
              !currentUser.resetPassword &&
              isOpenFeature("administration") &&
              isAllowed(currentUser.role, ADMIN) && (
                <li>
                  Administration
                  {currentUser && !currentUser.resetPassword && isAllowed(currentUser.role, ADMIN) && (
                    <ul>
                      {(currentUser.role === SUPER_ADMIN || currentUser.role === ADMIN_HOSPITAL) && (
                        <li>
                          <Link href="/administration/users">Administration des utilisateurs</Link>
                          <ul>
                            <li>
                              <Link href="/administration/users/new">Ajout d&apos;un utilisateur</Link>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/hospitals">Administration des établissements</Link>
                          <ul>
                            <li>
                              <Link href="/administration/hospitals/new">Ajout d&apos;un établissement</Link>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/askers">Administration des demandeurs</Link>
                          <ul>
                            <li>
                              <Link href="/administration/askers/new">Ajout d&apos;un demandeur</Link>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/attacks">Administration des attentats</Link>
                          <ul>
                            <li>
                              <Link href="/administration/attacks/new">Ajout d&apos;un attentat</Link>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/acts">Administration des actes</Link>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/messages">Administration des messages</Link>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/logos">Administration des logos</Link>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <Link href="/administration/footer-documents">Administration des documents du pied de page</Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              )}
          </ul>
        </div>
      </Layout>
      <style jsx>
        {`
          .sitemapPage {
            display: flex;
            justify-content: center;
            align-item: center;
            margin-top: 15vh !important;
            font-size: 1.2rem;
          }
          li {
            line-height: 3rem;
          }
          ul {
            list-style: square;
          }
        `}
      </style>
    </>
  )
}

export default SiteMapPage
