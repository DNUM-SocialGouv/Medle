import { sendMail } from "../email"

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"

function buildHtml() {
  const html = `
        <p>Bonjour,</p>
        <p>Votre accès à MedLé a été créé avec succès.</p>
        <p>Lors de votre première connexion sur <a href="${APP_URL}">Medlé</a>, votre adresse mail constitue votre identifiant. Vous devez configurer votre mot de passe en cliquant sur « J’ai oublié mon mot de passe ? » sur la page d’accueil.</p>
        <p>Pour toutes questions, vous pouvez consulter <a href="${APP_URL}/guide-utilisateur">le guide utilisateurs</a>, <a href="${APP_URL}/faq">la foire aux questions</a>, ou contacter l’équipe MedLé à l’adresse <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>.</p>
        <p>A bientôt sur Medlé</p>

        <p><i>INFORMATIONS RELATIVES AU TRAITEMENT DES DONNEES A CARACTERE PERSONNEL :</i></p>
        <p>La Direction générale de l’offre de soins (DGOS) en tant que responsable de traitement procède à un traitement de vos données personnelles pour le suivi et le pilotage de l’activité des structures de médecine légale via la plateforme MEDecine LEgale (MedLé).</p>
        <p>Ce traitement est fondé sur la mission d’intérêt public dans le cadre de la mission de financement des établissements de santé ayant des services de médecine légale et conformément au Règlement général sur la protection des données (RGPD) du 27 avril 2016 - article 6.1.a). Les textes fondant le traitement sont les suivants :</p>
        <ul>
          <li>Arrêté du 26 mars 2024 portant organisation de la direction générale de l’offre de soins en sous-directions (articles 3 et 4)</li>
          <li>Circulaire du 27 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
          <li>Circulaire du 28 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale</li>
          <li>Circulaire du 25 avril 2012 relative à la mise en œuvre de la réforme de la médecine légale</li>
        </ul>
        <p>Les données à caractère personnel recueillies concernent uniquement les utilisateurs de la plateforme MedLé et sont les suivantes :</p>
        <ul>
          <li>Données relatives aux utilisateurs de la plateforme MedLé : nom, prénom adresse e-mail professionnelle, numéro de département de l’établissement de santé</li>
          <li>Cookies : la politique des cookies dans le cadre du traitement MedLé est définie à travers le document en pieds de page du site</li>
        </ul>
        <p>Les données personnelles enregistrées sur la plateforme MedLé sont conservées 6 ans à compter de la consignation de l’examen médico-légal et ne peuvent être communiquées qu’aux utilisateurs de la plateforme MedLé à savoir les Ministères en charge de la Santé et de la Justice, les référents de médecine légale des agences régionales de santé (ARS), les tribunaux judiciaires et les personnels du Centre Hospitalier ayant en leur sein une structure de médecine légale. Les données à caractère personnel relatives aux utilisateurs de la plateforme MedLé sont supprimées dès la suppression du compte.</p>
        <p>Conformément au RGPD, les utilisateurs de la plateforme MedLé disposent des droits d’accès (article 15 du RGPD), de rectification (article 16 du RGPD), de limitation (article 18 du RGPD) et d’opposition (article 20 du RGPD) des données vous concernant.</p>
        <p>Vous pouvez exercer vos droits, en vous adressant au responsable de la plateforme MedLé : par mail à l’adresse suivante contact-medle@sante.gouv.fr ou en vous adressant au correspondant RGPD de la DGOS par mail à l’adresse suivante : <a href="mailto:dgos-rgpd@sante.gouv.fr">dgos-rgpd@sante.gouv.fr</a> ou par courrier à l’adresse suivante :</p>
        <ul>
          <li>Ministère chargé de la santé</li>
          <li>DGOS</li>
          <li>14 avenue Duquesne 75007 Paris.</li>
        </ul>
    `

  return html
}

async function sendWelcomeMail(email) {
  const info = await sendMail({
    html: buildHtml(),
    subject: "Création de votre compte MedLé",
    to: email,
  })

  console.debug(info)
}

export default sendWelcomeMail
