const knexConfig = require("../../knexfile");
const { sendMail } = require("../services/email");

const environment = process.env.NODE_ENV || "development"

const knex = require("knex")(knexConfig[environment])

const APP_URL = process.env.APP_BASE_URL || "http://localhost:3000"
const mailContact = process.env.MAIL_CONTACT;

exports.etpNotif = async () => {
    try {
        const getUsersForReminder = async () => {
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            const emails = await knex('users as u')
                .select('u.email')
                .leftJoin('employments as e', function () {
                    this.on('u.hospital_id', '=', 'e.hospital_id')
                        .andOnIn('e.month', [twoMonthsAgo.getMonth(), twoMonthsAgo.getMonth() + 1])
                        .andOn('e.year', '=', twoMonthsAgo.getFullYear())
                })
                .whereNull('e.hospital_id')
                .andWhere(function () {
                    this.whereIn('u.role', ['ADMIN_HOSPITAL', 'OPERATOR_GENERIC', 'OPERATOR_EMPLOYMENT'])
                })
                .distinct();

            return emails;
        };
        const emails = await getUsersForReminder();
        const html = `
              Bonjour,
          
              <p>Une demande de réinitialisation du mot de passe de votre compte a été effectuée par l'administrateur.</p>
          
              <p>Nous vous informons que les équivalents temps plein (ETP) du service de médecine légale n'ont pas été 
              renseignés dans MedLé depuis 2 mois ou plus. Pour rappel, ils doivent être enregistrés chaque mois, avant 
              le 5 du mois suivant.</p>

              <p>Ce message a été adressé à toutes les personnes du service ayant un compte MedLé permettant d'accéder à 
              l'onglet “Personnel”.</p>
              
              <p>Il s'agit d'une notification automatique, merci de ne pas y répondre directement. Pour toute question, 
              consultez la Foire aux questions <a href="${APP_URL}/faq">${APP_URL}/faq</a> ou contactez l'adresse <a href="mailto:${mailContact}">
              contact-medle@sante.gouv.fr</a>.</p>`

        const formattedEmails = emails.map(obj => obj.email)

        function sendEmailRecursively(recipientIndex) {
            if (recipientIndex >= formattedEmails.length) {
                console.log('All emails sent successfully!');
                return;
            }

            const recipient = formattedEmails[recipientIndex];

            const mailOptions = {
                html,
                subject: "MedLé - Rappel enregistrement personnel médecine légale",
                to: recipient,
            }

            sendMail(mailOptions).then(() => {
                // Send the next email recursively
                sendEmailRecursively(recipientIndex + 1);
            }).catch((error) => console.log(`Error occurred while sending email to ${recipient}:`, error));

        }
        sendEmailRecursively(0)
    } catch (e) {
        console.error("Error Knex Cron etp notif :", e)
    }
}