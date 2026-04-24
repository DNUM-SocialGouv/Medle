import Head from "next/head";
import Layout from "../components/Layout";
import { Title1 } from "../components/StyledComponents";
import { useUser } from "../hooks/useUser";
import styles from "./donnees-personnelles.module.css";

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
          <p>Le responsable de traitement des données à caractère personnel collectées par la plateforme MEDecine LEgale (Medlé) est la Direction générale de l’offre de soins (DGOS)</p>

          <h2>Finalités</h2>
          <p>La plateforme Medlé est un outil de reporting de l’activité médico-légale permettant le suivi et le pilotage et le financement de l’activité des structures de médecine légale.</p>
          <p>Elle traite des données à caractère personnel pour les finalités suivantes :</p>
          <ul>
            <li>Permettre aux structures de médecine légale de consigner l’activité réalisée sur réquisition judiciaire</li>
            <li>Suivre le nombre de personnels affectés aux activités de médecine légale</li>
            <li>Faciliter la déclaration, la consultation et l’évaluation de toutes les activités médico-légales réalisées dans les structures hospitalières dédiées</li>
            <li>Faciliter la déclaration, la consultation et l’évaluation des professionnels dédiés à ces activités.</li>
          </ul>

          <h2>Données à caractère personnel traitées</h2>
          <p>Les données à caractère personnel recueillies concernent uniquement les utilisateurs de la plateforme Medlé et sont les suivantes :</p>
          <ul>
            <li>Données relatives aux utilisateurs de la plateforme Medlé : nom, prénom adresse e-mail professionnelle, numéro de département de l’établissement de santé</li>
            <li>Cookies</li>
          </ul>

          <h2>Bases juridiques des traitements de données</h2>
          <p>Les données traitées par la plateforme s’appuient sur la mise en œuvre d’une mission de service public. Le traitement repose donc à la fois sur les notions d’intérêt public et de consentement des utilisateurs de la plateforme Medlé définies par le RGPD.</p>

          <h2>Les fondements juridiques de ce traitement de données personnelles sont précisés ci-dessous :</h2>
          <p>La mission d’intérêt public est notamment encadrée par :</p>
          <ul>
            <li>Arrêté du 26 mars 2024 portant organisation de la direction générale de l’offre de soins en sous-directions (articles 3 et 4)</li>
            <li>Circulaire du 27 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
            <li>Circulaire du 28 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
            <li>Circulaire du 25 avril 2012 relative à la mise en œuvre de la réforme de la médecine légale</li>
          </ul>
          <h2>Durée de conservation</h2>
          <table className={styles["reportTable"]}>
            <thead>
              <tr>
                <th>Type de données</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Données relatives à l’acte de médecine légale</td>
                <td><strong>6 ans</strong>, à compter de la consignation de l’examen médico-légal.</td>
              </tr>
              <tr>
                <td>Données relatives aux utilisateurs de la plateforme Medlé</td>
                <td><strong>Les données personnelles sont supprimées lors de la suppression du compte</strong></td>
              </tr>
            </tbody>
          </table>
          <br />
          <p>
            Les données enregistrées sur la plateforme Medlé sont conservées 6 ans à compter de la consignation de l’examen médico-légal et ne peuvent être communiquées qu’aux utilisateurs de la plateforme Medlé à savoir les Ministères en charge de la Santé et de la Justice,
            les référents de médecine légale des agences régionales de santé (ARS), les tribunaux judiciaires et les personnels du Centre Hospitalier ayant en leur sein une structure de médecine légale.
          </p>

          <h2>L’exercice des droits des utilisateurs de la plateforme Medlé</h2>
          <p>
            Ce traitement est fondé à la fois sur l’exercice d’une mission d’intérêt public et sur le consentement des utilisateurs de la plateforme Medlé dont les données à caractère personnel sont traitées (article 6.1.a) dans le cadre du Règlement général sur la protection des données (RGPD) du 27 avril 2016).
            Ce traitement permet plus particulièrement la mise en œuvre de la mission de financement des établissements de santé dont font partie les services de médecine légale conformément aux textes suivants :
          </p>
          <ul>
            <li>Arrêté du 26 mars 2024 portant organisation de la direction générale de l’offre de soins en sous-directions (articles 3 et 4)</li>
            <li>Circulaire du 27 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
            <li>Circulaire du 28 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
          </ul>
          <p>Exemple de mention d’information pour les utilisateurs de Medlé :</p>
          <p>
            Conformément au RGPD et à la loi n° 78-du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés (loi informatique et libertés) et dans les conditions prévues par ces mêmes textes,
            les utilisateurs de la plateforme disposent d’un droit d’accès (article 15 du RGPD), de rectification (article 16 du RGPD) et de limitation (article 18 du RGPD) des données vous concernant.
          </p>
          <p>Vous pouvez exercer vos droits, en vous adressant au responsable de la plateforme Medlé : par mail à l’adresse suivante contact-medle@sante.gouv.fr
            ou en vous adressant au correspondant RGPD de la DGOS par mail à l’adresse suivante : dgos-rgpd@sante.gouv.fr ou par courrier à l’adresse suivante : Ministère chargé de la santé – DGOS – 14 avenue Duquesne 75007 Paris.
          </p>
          <p>
            Un mail est systématiquement adressé à l’utilisateur lors de l’ouverture de son compte et libellé de la manière suivante : « La Direction générale de l’offre de soins procède à un traitement de vos données personnelles pour le suivi et pilotage de l’activité des structures de médecine légale.
            Vous pouvez exercer vos droits, en vous adressant au responsable de la plateforme Medlé : par mail à l’adresse suivante contact-medle@sante.gouv.fr ou en vous adressant au correspondant RGPD de la DGOS par mail à l’adresse suivante : dgos-rgpd@sante.gouv.fr
            ou par courrier à l’adresse suivante : Ministère chargé de la santé – DGOS – 14 avenue Duquesne 75007 Paris.
          </p>
          <p>Vous disposez également du droit d’introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL), si vous considérez que le traitement de données à caractère personnel vous concernant constitue une violation du RGPD et de la loi informatique et libertés. »</p>
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
