import { sendMail } from "../email"

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"

function buildHtml() {
  const html = `
    <p>Bonjour,</p>
    <p>Nous sommes ravis de vous informer que votre compte a été créé avec succès sur Medlé.</p>
    <p>Cependant, pour des raisons de sécurité, nous vous invitons à créer votre propre mot de passe en utilisant le lien "J'ai oublié mon mot de passe" que vous trouverez sur la page d'accueil de l'application.</p>
    <p>Voici les étapes à suivre pour créer votre propre mot de passe :</p>
    <ol>
       <li>Allez sur la page d'accueil de l'application et cliquez sur le lien "J'ai oublié mon mot de passe".</li>
       <li>Entrez l'adresse e-mail que vous avez fournis et cliquez sur "Envoyer un email".</li>
       <li>Vous recevrez un e-mail avec un lien pour réinitialiser votre mot de passe.</li>
       <li>Cliquez sur ce lien et suivez les instructions pour créer votre propre mot de passe.</li>
    </ol>
    <p>Si vous ne souhaitez pas réinitialiser votre mot de passe, vous pouvez ignorer cet e-mail.</p>
    
    <p>A bientôt sur Medlé,</p>
    
    <p>Des questions sur Medlé? La réponse se trouve peut-être dans la <a href="${APP_URL}/api/footer-documents?type=footerDocumentFAQ">foire aux questions</a>.</p>
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
