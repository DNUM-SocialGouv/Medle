import Head from "next/head";

import ReportTable from "../components/accessibilite/reportTable/ReportTable";
import Layout from "../components/Layout";
import { Title1 } from "../components/StyledComponents";
import { useUser } from "../hooks/useUser";

export default function Accessibilite() {
  const currentUser = useUser();

  return (
    <>
      <Layout page="accessibilite" currentUser={currentUser}>
        <Head>
          <title>Déclaration d&apos;accessibilité</title>
        </Head>

        <Title1 className="mt-5 mb-4">Déclaration d&apos;accessibilité</Title1>

        <div className="accessibilite mt-5">
          <p>L’Etat s’engage à rendre son site internet accessible conformément à l’article 47 de la loi n°2005-102 du 11 février 2005.</p>
          <p>À cette fin, elle met en œuvre la stratégie et les actions suivantes :</p>
          <ul>
            <li>« Le Schéma pluriannuel de mise en accessibilité 2021-2023 ainsi que le Plan d’actions 2021-2022 sont en cours de rédaction et seront publiés
              prochainement »</li>
          </ul>
          <p>Cette déclaration d’accessibilité s’applique à https://medle.sante.gouv.fr/</p>

          <h1>État de conformité</h1>
          <p>Le site https://medle.sante.gouv.fr/ est partiellement conforme avec le référentiel général d’amélioration de l’accessibilité (RGAA), version 4.1 en raison des
            non-conformités et des dérogations énumérées ci-dessous.</p>

          <h1>Résultats des tests</h1>
          <p>L’audit de conformité réalisé par Urbilog révèle que 75% des critères du RGAA version 4.1 sont respectés.</p>
          <p>Le taux moyen de conformité du service en ligne s’élève à 85%.</p>
          <p>Vous pouvez <a href="#recapitulatif">consulter le récapitulatif du taux de conformité RGAA.</a></p>
          <p>On compte 59 critères applicables sur 106 parmi lesquels :</p>
          <ul>
            <li>45 critère conformes</li>
            <li>15 critères non conformes</li>
          </ul>

          <h1>Contenus non accessibles</h1>
          <p>Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes :</p>

          <h2>Non-conformité</h2>
          <ol>
            <li>Images :
              <ul>
                <li>Des images décoratives sans alternative bien présente mais vide</li>
              </ul>
            </li>
            <li>Cadres : RAS</li>
            <li>Couleurs :
              <ul>
                <li>De l’information transmise uniquement par la couleur</li>
              </ul>
            </li>
            <li>Multimédia : RAS</li>
            <li>Tableaux : RAS</li>
            <li>Liens :
              <ul>
                <li>Des liens ne sont pas suffisamment explicites</li>
              </ul>
            </li>
            <li>Stripts :
              <ul>
                <li>Des scripts ne sont pas compatibles avec les technologies d’assistance</li>
              </ul>
            </li>
            <li>Éléments obligatoires : RAS</li>
            <li>Structuration de l’information : RAS</li>
            <li>Présentation :
              <ul>
                <li>Certaines pages ne sont plus compréhensibles lorsque les feuilles de style sont désactivées</li>
                <li>Certains textes ne sont plus lisibles lorsque la taille des caractères est augmentée jusqu’à 200%</li>
                <li>Certains contenus ne sont plus visibles avec une fenêtre ayant une largeur de 320px</li>
                <li>Certaines propriétés d’espacement ne sont pas réalisables par l’utilisateur sans perte d’information</li>
                <li>Des contenus additionnels apparaissant à la prise de focus ou au survol ne sont pas contrôlables par l’utilisateur</li>
              </ul>
            </li>
            <li>Formulaires :
              <ul>
                <li>Des étiquettes ne sont pas associées à leur champ</li>
                <li>Des boutons ne possèdent pas d’intitulé pertinent</li>
                <li>Le contrôle de saisie n’est pas toujours utilisé de manière pertinente</li>
                <li>Le contrôle de saisie n’est pas toujours accompagné des suggestions nécessaires</li>
              </ul>
            </li>
            <li>Navigation :
              <ul>
                <li>L’ordre de tabulation est parfois incohérent</li>
                <li>Des contenus additionnels apparaissant à la prise de focus ou au survol ne sont pas atteignables au clavier</li>
              </ul>
            </li>
            <li>Consultation : RAS</li>
          </ol>

          <h1>Établissement de cette déclaration d’accessibilité</h1>
          <p>Cette déclaration a été établie le 18 février 2022.</p>

          <h2>Technologies utilisées pour la réalisation de [nom, url du site]</h2>
          <ul>
            <li>HTML5</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <h2>Environnement de test</h2>
          <p>Les vérifications de restitution de contenus ont été réalisées sur la base de la combinaison fournie par la base de référence du RGAA 4.1, avec les versions
            suivantes :</p>
          <ul>
            <li>NVDA 2021.3 et Firefox 95.0</li>
            <li>JAWS 2021 et Internet Explorer 11</li>
            <li>VoiceOver Mac OS 12.0.1 et Safari 15.1</li>
          </ul>

          <h2>Outils pour évaluer l’accessibilité</h2>
          <ul>
            <li>WCAG Color Contrast Checker</li>
            <li>Assistant RGAA V4.1</li>
            <li>Web Developer toolbar</li>
            <li>Inspecteur du navigateur</li>
          </ul>

          <h2>Pages du site ayant fait l’objet de la vérification de conformité</h2>
          <ul>
            <li>
              Page «Connexion» :
              <br />
              <a href="https://medle.sante.gouv.fr/">https://medle.sante.gouv.fr/</a>
            </li>
            <li>
              Page «Accueil avec graphiques» :
              <br />
              <a href="https://medle.sante.gouv.fr/statistics">https://medle.sante.gouv.fr/statistics</a>
            </li>
            <li>
              Page «Tous les actes» :
              <br />
              <a href="https://medle.sante.gouv.fr/acts">https://medle.sante.gouv.fr/acts</a>
            </li>
            <li>
              Page «Ajout utilisateur (admin)» :
              <br />
              <a href="https://medle.sante.gouv.fr/administration/users/new">https://medle.sante.gouv.fr/administration/users/new</a>
            </li>
            <li>
              Page «Détails utilisateur (admin)» :
              <br />
              <a href="https://medle.sante.gouv.fr/administration/users/281">https://medle.sante.gouv.fr/administration/users/281</a>
            </li>
            <li>
              Page «Saisie ETP» :
              <br />
              <a href="https://medle.sante.gouv.fr/employments">https://medle.sante.gouv.fr/employments</a>
            </li>
            <li>
              Page «Ajout d’acte» :
              <br />
              <a href="https://medle.sante.gouv.fr/acts/declaration">https://medle.sante.gouv.fr/acts/declaration</a>
            </li>
            <li>
              Page «Mentions légales» :
              <br />
              <a href="https://medle.sante.gouv.fr/mentions">https://medle.sante.gouv.fr/mentions</a>
            </li>
            <li>
              Page «FAQ» :
              <br />
              <a href="https://medle.sante.gouv.fr/faq">https://medle.sante.gouv.fr/faq</a>
            </li>
            <li>
              Page «Plan de site» :
              <br />
              <a href="https://medle.sante.gouv.fr/sitemap">https://medle.sante.gouv.fr/sitemap</a>
            </li>
          </ul>

          <h1>Retour d’information et contact</h1>
          <p>Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de Medle (medle.sante.gouv.fr) pour être orienté vers une
            alternative accessible ou obtenir le contenu sous une autre forme.</p>
          <ul>
            <li>Envoyer un message à <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a></li>
            <li>Contact : DGOS : <a href="https://solidarites-sante.gouv.fr/ministere/organisation/organisation-des-directions-et-services/article/organisation-de-la-direction-generale-de-l-offre-de-soins-dgos">Organisation DGOS</a></li>
          </ul>

          <h1>Voies de recours</h1>
          <p>Cette procédure est à utiliser dans le cas suivant.</p>
          <p>Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous
            n’avez pas obtenu de réponse satisfaisante.</p>
          <ul>
            <li>Écrire un message au Défenseur des droits <a href="https://formulaire.defenseurdesdroits.fr/">https://formulaire.defenseurdesdroits.fr/</a></li>
            <li>Contacter le délégué du Défenseur des droits dans votre région <a href="https://www.defenseurdesdroits.fr/saisir/delegues">https://www.defenseurdesdroits.fr/saisir/delegues</a></li>
            <li>
              <p>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :</p>
              <p>
                Défenseur des droits<br />
                Libre réponse 71120<br />
                75342 Paris CEDEX 07<br />
              </p>
            </li>
          </ul>

          <h1>Tableau récapitulatif du taux de conformité RGAA :</h1>
          <ReportTable />
        </div>
      </Layout >

      <style jsx>{`
        .accessibilite {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}
