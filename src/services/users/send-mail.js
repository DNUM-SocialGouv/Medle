import { sendMail } from "../email"

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"

function buildHtml() {
  const html = `
    <p>Bonjour,</p>
    
    <p>Votre accès à MedLé a été créé avec succès.</p>
    
    <p>Lors de votre première connexion sur 
    <a href="https://medle.sante.gouv.fr">https://medle.sante.gouv.fr</a>, votre adresse mail constitue votre 
    identifiant. Vous devez configurer votre mot de passe en cliquant sur « J'ai oublié mon mot de passe ? » sur 
    la page d'accueil.</p>
    
    <p>Pour toute questions, vous pouvez consulter 
    <a href="${APP_URL}/api/footer-documents?type=footerDocumentUserGuide">le guide utilisateurs</a>, 
    <a href="${APP_URL}/api/footer-documents?type=footerDocumentFAQ">la foire aux questions</a>,
    ou contacter l'équipe MedLé à l'adresse contact-medle@sante.gouv.fr.</p>
    
    <p>A bientôt sur Medlé</p>

    <p><i>INFORMATIONS RELATIVES AU TRAITEMENT DES DONNEES PERSONNELLES :</i></p>  
    
    <p>La Direction générale de l'offre de soins procède à un traitement de vos données personnelles pour le suivi 
    et pilotage de l'activité des structures de médecine légale.</p>
    
    <p>Ce traitement est fondé sur le consentement des personnes dont les données à caractère personnel sont traitées 
    (article 6.1.a) du Règlement général sur la protection des données (RGPD) du 27 avril 2016). Et plus particulièrement 
    dans le cadre de la mise en œuvre de la mission de financement des établissements de santé dont font partie les 
    services de médecine légale conformément aux textes suivants :</p>
    
    <ul>
      <li>arrêté du 7 mai 2014 modifié portant organisation de la direction générale de l'offre de soins ;</li>
      <li>circulaire du 27 décembre 2010 relative à la mise en œuvre de la réforme de la médecine légale.</li>
    </ul>
    
    <p>Conformément au RGPD et à la loi n° 78-du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés 
    (loi informatique et libertés) et dans les conditions prévues par ces mêmes textes, vous disposez d'un droit d'accès,
    de rectification, d'effacement et de portabilité des données vous concernant. Vous pouvez également demander la 
    limitation du traitement de vos données et retirer votre consentement au traitement de vos données à tout moment.</p>
    
    <p>Vous pouvez exercer ces droits, en vous adressant au responsable de traitement : par mail à l'adresse suivante 
    contact-medle@sante.gouv.fr</p>
    
    <p>Vous disposez d'un droit d'introduire une réclamation auprès de la Commission nationale de l'informatique et des 
    libertés (CNIL), si vous considérez que le traitement de données à caractère personnel vous concernant constitue une 
    violation du RGPD et de la loi informatique et libertés.</p>
    <p>Coordonnées du délégué à la protection des données :</p>

    <p>Daniela PARROT</p>
    
    <p>daniela.parrot@sg.social.gouv.fr</p>
    
    <p>14 avenue Duquesne 75007 PARIS</p>
    `

  return html
}

async function sendWelcomeMail(email) {
  const info = await sendMail({
    html: buildHtml(),
    subject: "Demande de réinitialisation de mot de passe Medlé",
    to: email,
  })

  console.debug(info)
}

export default sendWelcomeMail
