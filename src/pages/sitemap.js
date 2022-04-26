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
              <a href="/">Connexion</a>
            </li>
            <li>
              <a href="/forgot-password">Mot de passe oublié</a>
            </li>
            {currentUser &&
              !currentUser.resetPassword &&
              isAllowed(currentUser.role, ACT_MANAGEMENT) &&
              currentUser.role !== SUPER_ADMIN && (
                <li>
                  <a href="/acts/declaration">Ajout d&apos;acte</a>
                </li>
              )}
            {currentUser && !currentUser.resetPassword && isAllowed(currentUser.role, ACT_CONSULTATION) && (
              <li>
                <a href="/acts">Tous les actes</a>
              </li>
            )}
            {currentUser && !currentUser.resetPassword && isAllowed(currentUser.role, EMPLOYMENT_CONSULTATION) && (
              <li>
                <a href="/employments">Personnel</a>
              </li>
            )}
            {currentUser && !currentUser.resetPassword && (
              <li>
                <a href="/statistics">Statistiques</a>
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
                          <a href="/administration/users">Administration des utilisateurs</a>
                          <ul>
                            <li>
                              <a href="/administration/users/new">Ajout d&apos;un utilisateur</a>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/hospitals">Administration des établissements</a>
                          <ul>
                            <li>
                              <a href="/administration/hospitals/new">Ajout d&apos;un établissement</a>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/askers">Administration des demandeurs</a>
                          <ul>
                            <li>
                              <a href="/administration/askers/new">Ajout d&apos;un demandeur</a>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/attacks">Administration des attentats</a>
                          <ul>
                            <li>
                              <a href="/administration/attacks/new">Ajout d&apos;un attentat</a>
                            </li>
                          </ul>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/acts">Administration des actes</a>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/messages">Administration des messages</a>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/logos">Administration des logos</a>
                        </li>
                      )}
                      {currentUser.role === SUPER_ADMIN && (
                        <li>
                          <a href="/administration/footer-documents">Administration des documents du pied de page</a>
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
