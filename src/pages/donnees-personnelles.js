import Head from "next/head";
import Layout from "../components/Layout";
import { Title1 } from "../components/StyledComponents";
import { useUser } from "../hooks/useUser";

export default function DonneesPersonnelles() {
  const currentUser = useUser();

  return (
    <>
      <Layout page="donnees-personnelles" currentUser={currentUser}>
        <Head>
          <title>Traitement des données à caractère personnel</title>
        </Head>

        <Title1 className="mt-5 mb-4">Traitement des données à caractère personnel</Title1>

        <div className="donnees-personnelles mt-5">
          <p>Le responsable de traitement des données à caractère personnel collectées par la plateforme Medlé est Cécile LAMBERT, Directrice générale de l’offre de soins (DGOS) par intérim.</p>

          <h2>Finalités</h2>
          <p>La plateforme Medlé est un outil de reporting de l’activité médico-légale permettant le suivi de cette activité. Elle peut traiter des données à caractère personnelles pour les finalités suivantes :</p>
          <ul>
            <li>Permettre aux structures de médecine légale de consigner l’activité réalisée sur réquisition judiciaire et les personnels affectés ;</li>
            <li>Faciliter la déclaration, la consultation et l’évaluation de toutes les activités médico-légales réalisées dans les structures hospitalières dédiées ;</li>
            <li>Faciliter la déclaration, la consultation et l’évaluation des professionnels dédiés à ces activités.</li>
          </ul>

          <h2>Données à caractère personnel traitées</h2>
          <p>La plateforme peut traiter les données à caractère personnel suivantes :</p>
          <ul>
            <li>Données relatives à la personne examinée (sexe, genre, tranche d’âge, tranche horaire de l’examen, données de contexte de l’acte violent, lieu de l’examen) ;</li>
            <li>Données relatives à l’acte violent (type de violence) ;</li>
            <li>Données relatives aux agents utilisateurs (adresse e-mail, service) ;</li>
            <li>Données d’hébergeur/de connexion ;</li>
            <li>Cookies</li>
          </ul>

          <h2>Bases juridiques des traitements de données</h2>
          <p>Les données traitées par la plateforme ont plusieurs fondements juridiques :</p>
          <ul>
            <li>Le consentement de la personne concernée pour une ou plusieurs finalités spécifiques au sens de l’article 6-a du RGPD et en application de l’article 5(3) de la directive 2002/58/CE modifiée ;</li>
            <li>L’obligation légale à laquelle est soumise le responsable de traitements au sens de l’article 6-c du RGPD ;</li>
            <li>L’exécution d’une mission d’intérêt public ou relevant de l’exercice de l’autorité publique dont est investi le responsable de traitement au sens de l’article 6-e du RPGD ;</li>
            <li>Des motifs d’intérêt public dans le domaine de la santé publique au sens de l’article 9 paragraphe 2-i du RGPD.</li>
          </ul>

          <h2>Ces fondements sont précisés ci-dessous :</h2>
          <h3>a) Données relatives à la personne examinée</h3>
          <p>Ce traitement est nécessaire à l’exécution d’une mission d’intérêt public ou relevant de l’exercice de l’autorité publique dont est investi le responsable de traitement au sens de l’article 6-e du règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.</p>
          <p>Cette mission d’intérêt public est notamment posée par :</p>
          <ul>
            <li>les articles 3 et 4 de l’arrêté du 7 mai 2014 modifié portant organisation de la direction générale de l’offre de soins ;</li>
            <li>la circulaire du 27 décembre 2010 relative à la mise en oeuvre de la réforme de la médecine légale.</li>
          </ul>

          <h3>b) Données relatives à l’acte violent</h3>
          <p>Ce traitement est nécessaire pour des motifs d’intérêts publics dans le domaine de la santé publique au sens de l’article 9 paragraphe 2-i du règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.</p>
          <p>Ces motifs d’intérêts publics dans le domaine de la santé figurent notamment dans :</p>
          <ul>
            <li>les articles 3 et 4 de l’arrêté du 7 mai 2014 modifié portant organisation de la direction générale de l’offre de soins ;</li>
            <li>la circulaire du 27 décembre 2010 relative à la mise en oeuvre de la réforme de la médecine légale.</li>
          </ul>

          <h3>c) Données relatives aux agents utilisateurs</h3>
          <p>Ce traitement est nécessaire à l’exécution d’une mission d’intérêt public ou relevant de l’exercice de l’autorité publique dont est investi le responsable de traitement au sens de l’article 6-e du règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.</p>
          <p>Cette mission d’intérêt public est notamment posée par :</p>
          <ul>
            <li>les articles 3 et 4 de l’arrêté du 7 mai 2014 modifié portant organisation de la direction générale de l’offre de soins ;</li>
            <li>la circulaire du 27 décembre 2010 relative à la mise en oeuvre de la réforme de la médecine légale.</li>
          </ul>

          <h3>d) Données d’hébergeur ou de connexion</h3>
          <p>Ce traitement est nécessaire au respect d&apos;une obligation légale à laquelle le responsable de traitement est soumis au sens de l&apos;article 6-c du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel et à la libre circulation de ces données.</p>
          <p>L&apos;obligation légale est posée par la loi LCEN n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique et par les articles 1 et 3 du décret n°2011-219 du 25 février 2011.</p>

          <h2>Durée de conservation</h2>
          <table>
            <thead>
              <tr>
                <th>Type de données</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Données relatives à la personne examinée</td>
                <td>3 ans, à compter de la consignation de l’examen médico-légal.</td>
              </tr>
              <tr>
                <td>Données relatives à l’acte violent</td>
                <td>3 ans, à compter de la consignation de l’examen médico-légal.</td>
              </tr>
              <tr>
                <td>Données relatives aux agents utilisateurs</td>
                <td>1 an, à compter de la fin du contrat de l’agent.</td>
              </tr>
              <tr>
                <td>Données d’hébergeur</td>
                <td>1 an, conformément au décret n°2011-219 du 25 février 2011.</td>
              </tr>
            </tbody>
          </table>

          <h2>Droit des personnes concernées</h2>
          <p>Vous disposez des droits suivants concernant vos données à caractère personnel :</p>
          <ul>
            <li>Droit d’information et droit d’accès aux données</li>
            <li>Droit de rectification et le cas échéant de suppression des données</li>
            <li>Droit au retrait du consentement en matière de cookies uniquement</li>
          </ul>

          <p>Pour les exercer, faites-nous parvenir une demande en précisant la date et l’heure précise de la requête – ces éléments sont indispensables pour nous permettre de retrouver votre recherche – par voie électronique à l’adresse suivante :</p>
          <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>
          <p>En raison de l’obligation de sécurité et de confidentialité dans le traitement des données à caractère personnel qui incombe au responsable de traitement, votre demande ne sera traitée que si vous apportez la preuve de votre identité.
            Pour vous aider dans votre démarche, vous trouverez ici <a href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">Exercer son droit d&apos;accès</a>, un modèle de courrier élaboré par la CNIL.</p>
          <p>Le responsable de traitement s’engage à répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre demande.</p>

          <h2>Destinataires des données</h2>
          <p>Le responsable de traitement s’engage à ce que les données à caractères personnels soient traitées par les seules personnes autorisées.</p>

          <h2>Sécurité et confidentialité des données</h2>
          <p>Les mesures techniques et organisationnelles de sécurité adoptées pour assurer la confidentialité, l’intégrité et protéger l’accès des données sont notamment :</p>
          <ul>
            <li>Anonymisation</li>
            <li>Stockage des données en base de données</li>
            <li>Stockage des mots de passe en base sont hâchés</li>
            <li>Cloisonnement des données</li>
            <li>Mesures de traçabilité</li>
            <li>Surveillance</li>
            <li>Protection contre les virus, malwares et logiciels espions</li>
            <li>Protection des réseaux</li>
            <li>Sauvegarde</li>
            <li>Mesures restrictives limitant l’accès physiques aux données à caractère personnel</li>
          </ul>

          <h2>Sous-traitants</h2>
          <p>Certaines des données sont envoyées à des sous-traitants pour réaliser certaines missions. Le responsable de traitement s&apos;est assuré de la mise en oeuvre par ses sous-traitants de garanties adéquates et du respect de conditions strictes de confidentialité, d’usage et de protection des données.</p>
          <table>
            <thead>
              <tr>
                <th>Partenaire</th>
                <th>Pays destinataire</th>
                <th>Traitement réalisé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cegedim SA</td>
                <td>France</td>
                <td>Hébergement</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>

      <style jsx>{`
        .donnees-personnelles {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}
