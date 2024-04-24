const dotenv = require("dotenv")
const { createTransport } = require("nodemailer")

dotenv.config()

const transportConfig = {
  auth: {
    pass: process.env.MAIL_PASSWORD,
    user: process.env.MAIL_USERNAME,
  },
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
}

exports.sendMail = async ({ subject, text, html, attachments, to }) => {
  const mailOptions = {
    attachments,
    from: process.env.MAIL_FROM,
    html,
    subject,
    text,
    to,
  }

  const transporter = createTransport(transportConfig)

  return transporter.sendMail(mailOptions)
}

/*
Pinterest


Désolé
Le lien de réinitialisation du mot de passe n'est pas valide ou a expiré (durée de validité : 24 heures), peut-être parce qu'il a déjà été utilisé.
Veuillez demander une nouvelle réinitialisation du mot de passe


*/
