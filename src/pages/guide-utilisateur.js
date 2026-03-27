import Head from "next/head"
import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import { useUser } from "../hooks/useUser"
import { withAuthentication } from "../utils/auth"
import { ADMIN } from "../utils/roles"
import Image from "next/image"

const GuideUtilisateurPage = () => {
  const currentUser = useUser();
  return (
    <>
      <Layout page="guide-utilisateur" currentUser={currentUser}>
        <Head>
          <title>Guide d’utilisation - Medlé</title>
        </Head>
        <Title1 className="mt-5 mb-4">{"Guide d’utilisation"}</Title1>

        <div className="guide-utilisateur mt-5">
          <h1>Sommaire:</h1>
          <ul>
            <li><a href="#quest-medle">Qu’est-ce que MedLé ?</a></li>
            <li><a href="#comment-compte">Comment créer un compte pour accéder à Medlé ?</a></li>
            <li><a href="#comment-act">Comment saisir un acte ?</a></li>
            <li><a href="#comment-etp">Comment saisir les ETP ?</a></li>
            <li><a href="#question">Une question concernant Medlé ?</a></li>
            <li><a href="#cybersecurite">Cybersécurité : Les bonnes pratiques à adopter</a></li>
          </ul>
          <br />
          <br />
          <br />
          <h1 id="quest-medle">Qu’est-ce que Medlé ?</h1>
          <p>MedLé est la plateforme de suivi de l’activité des structures de médecine légale suivantes</p>
          <ul>
            <li>Les Unités Médico Judiciaires ( et les Instituts Médico Légaux ( du schéma directeur (<i>conformément aux circulaires du 27 décembre 2010 et du 25 avril 2012 relatives à la mise en oeuvre de la réforme de la médecine légale</i>)</li>
            <li>Les UMJ de proximité et leurs annexes pour lesquelles une convention a été signée et validée par le ministère de la Justice</li>
          </ul>
          <p>L’objectif de MedLé est:</p>
          <ul>
            <li>D’avoir une visibilité sur l’activité et les ETP (Equivalents Temps Plein) de chaque structure</li>
            <li>D’avoir des indicateurs synthétiques de l’activité de la structure via un tableau de bord, et <i>in fine</i> de pouvoir faire des analyses statistiques</li>
          </ul>
          <p>Concrètement, pour utiliser MedLé, l’établissement de santé désigne des personnes qui pourront avoir accès à MedLé dans chaque structure, qui seront considérées comme les utilisateurs (par exemple, un personnel administratif, un professionnel responsable de la structure, un membre du secrétariat Les utilisateurs peuvent avoir différents profils dans MedLé</p>
          <p>Droits ouverts à chaque profil utilisateur: </p>
          <table>
            <theader>
              <tr>
                <th>Type de profil</th>
                <th>Saisir les actes</th>
                <th>Saisir les ETP</th>
                <th>Consulter les statistiques locales et nationales</th>
                <th>Gérer les profils rattachés à la structure</th>
              </tr>
            </theader>
            <tbody>
              <tr>
                <td>Gestionnaire d’actes</td>
                <td className="ok"></td>
                <td className="ko"></td>
                <td className="ok"></td>
                <td className="ko"></td>
              </tr>
              <tr>
                <td>Gestionnaire d’ETP</td>
                <td className="ko"></td>
                <td className="ok"></td>
                <td className="ok"></td>
                <td className="ko"></td>
              </tr>
              <tr>
                <td>Gestionnaire d’actes et d’ETP</td>
                <td className="ok"></td>
                <td className="ok"></td>
                <td className="ok"></td>
                <td className="ko"></td>
              </tr>
              <tr>
                <td>Administrateur d’UMJ/IML</td>
                <td className="ok"></td>
                <td className="ok"></td>
                <td className="ok"></td>
                <th>Fonctionnalité en cours de création</th>
              </tr>
              <tr>
                <td>Superviseur régional (Cour d’Appel, Tribunal Judiciaire et Agence Régionale de Santé)</td>
                <td className="ko"></td>
                <td className="ko"></td>
                <td className="ok"></td>
                <td className="ko"></td>
              </tr>
            </tbody>
          </table>

          <h1 id="comment-compte">Comment créer un compte pour accéder à Medlé ?</h1>
          <p>Les demandes de création d’accès pour les utilisateurs de MedLé doivent être envoyées par mail à l’adresse <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>.</p>
          <p>Dans cette demande, il faut indiquer les informations suivantes : nom et prénom de la personne, adresse mail, fonction au sein de l’établissement et type de profil souhaité (voir page 4 : gestionnaire d’actes et/ou d’ETP, administrateur de la structure)</p>
          <p>Vous recevrez ensuite une confirmation de la création de votre accès.</p>
          <p>Lors de votre première connexion sur <a href="https:// medle.sante.gouv.fr">https:// medle.sante.gouv.fr</a> , votre adresse mail constitue votre identifiant. Vous devez configurer votre mot de passe en cliquant sur « Mot de passe oublié ? » s ur la page de connexion.</p>
          <p>Pour une utilisation optimale de MedLé, utilisez de préférence les navigateurs Google Chrome ou Mozilla Firefox.</p>
          <Image src="/images/oubli-mdp.png" width="730" height="210" alt="Page de connexion, récupération de mot de passe" />

          <h1 id="comment-act">Comment saisir un acte ?</h1>
          <p><b>Cliquer sur « Ajout d’acte » dans la colonne à gauche de l’écran</b></p>
          <Image src="/images/ajout-acte.png" width="143" height="336" alt="Bouton d’ajout de nouvel acte" />
          <p><b>Remplir les données d’identification de l’acte.</b></p>
          <p>Le numéro interne, la date d’examen et le nom du service demandeur doivent obligatoirement être complétés.</p>
          <Image src="/images/donnee-id-acte.png" width="645" height="203" alt="Formulaire des données d’identification de l’acte" />
          <p><b>Cocher les cases correspondant à l’acte et cliquer sur « Valider » à la fin de chaque étape.</b></p>
          <p>Une fois enregistrés, les actes sont modifiables via l’onglet « Tous les actes »</p>
          <Image src="/images/informations-acte.png" width="549" height="219" alt="Formulaire des données d’identification de l’acte" />
          <p>Si vous avez des questions au sujet de la saisie des actes, vous pouvez vous référer à la Foire Aux Questions</p>

          <h1 id="comment-etp">Comment saisir les ETP ?</h1>
          <p><b>Cliquer sur « Personnel » dans la colonne à gauche de l’écran</b></p>
          <Image src="/images/ajout-etp.png" width="127" height="239" alt="Bouton d’ajout d’une déclaration d’ETP" />
          <p><b>L’écran suivant s’ouvre :</b></p>
          <Image src="/images/formulaire-etp.png" width="977" height="669" alt="Formulaire de déclaration d’ETP" />
          <ul>
            <li>Il est fortement recommandé que les ETP soient renseignés au plus tard au début du mois suivant.</li>
            <li>Tous les ETP de l’année doivent obligatoirement être renseignés en janvier de l’année N+1 (par exemple, les ETP de l’année 2021 doivent être complets en janvier 2022)</li>
            <li>Les ETP saisis sont modifiables durant toute l’année en cours.</li>
          </ul>

          <h1 id="question">Une question concernant Medlé ?</h1>
          <ul>
            <li>Consultez la « Foire Aux Questions », accessible depuis le bas de page de MedLé:
              <Image src="/images/footer-faq.png" width="630" height="30" alt="Lien vers la FAQ en bas de page" />
            </li>
            <li>Si votre question n’est pas référencée, envoyez un mail à <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>. Une réponse vous sera apportée dans les meilleurs délais.</li>
          </ul>

          <h1 id="cybersecurite">Cybersécurité : Les bonnes pratiques à adopter</h1>
          <p>MedLé est une application qui contient des données importantes relatives à l’activité de votre structure de médecine légale. Pour garantir la sécurité des utilisateurs et des données enregistrées, veillez à respecter les principes suivants :</p>
          <ul>
            <li>Votre compte MedLé est personnel et ne doit pas être utilisé par une autre personne du service. L’adresse mail utilisée pour la création de votre compte doit être votre adresse mail professionnelle.</li>
            <li>
              Votre mot de passe ne doit pas être communiqué à d’autres personnes, même au sein de votre service.
              <ul>
                <li>Veillez à ne pas conserver votre mot de passe écrit sur un papier à proximité de votre poste de travail.</li>
                <li>Ne préenregistrez pas votre mot de passe dans votre navigateur</li>
              </ul>
            </li>
          </ul>
        </div>
      </Layout>

      <style jsx>{`
        .guide-utilisateur {
          max-width: 900px;
          margin: 0 auto;
        }

        h2 {
          color: #000091;
        }

        .ko {
          background-color: #e10000f;
        }

        .ok {
          background-color: #1f8d49;
        }
      `}</style>
    </>
  )
}

export default withAuthentication(GuideUtilisateurPage, ADMIN)
