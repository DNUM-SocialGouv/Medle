import Head from "next/head"
import Layout from "../components/Layout"
import { Title1 } from "../components/StyledComponents"
import { useUser } from "../hooks/useUser"
import { withAuthentication } from "../utils/auth"
import { ADMIN } from "../utils/roles"

const FaqPage = () => {
  const currentUser = useUser();
  return (
    <>
      <Layout page="faq" currentUser={currentUser}>
        <Head>
          <title>Foire aux questions - Medlé</title>
        </Head>
        <Title1 className="mt-5 mb-4">{"Foire aux questions"}</Title1>

        <div className="faq mt-5">
          <h1>Sommaire:</h1>
          <ul>
            <li><a href="#quest-medle">Qu’est-ce que MedLé ?</a></li>
            <li><a href="#comment-medle">Comment utiliser MedLé ?</a></li>
            <li><a href="#comment-act">Comment ajouter un acte ?</a></li>
            <li><a href="#comment-stats">Comment consulter les statistiques ?</a></li>
            <li><a href="#comment-employe">Comment déclarer le personnel employé ?</a></li>
          </ul>
          <br />
          <br />
          <br />
          <h1 id="quest-medle">Qu’est-ce que Medlé ?</h1>
          <h2>Qui peut utiliser Medlé ?</h2>
          <p>MedLé est accessible aux structures de médecine légale suivantes :</p>
          <ul>
            <li>Les unités médico-judiciaires (UMJ) et les instituts médico-légaux (IML) du schéma directeur (voir ci-dessous : Qu&apos;entend-on par « schéma directeur de la médecine légale » ?).</li>
            <li>Les UMJ de proximité et leurs annexes pour lesquelles une convention a été signée et validée par le ministère de la Justice.</li>
          </ul>
          <p>Concrètement, pour utiliser MedLé, l’établissement de santé désigne des personnes qui pourront avoir accès à MedLé dans chaque structure, qui seront considérées comme les utilisateurs (par exemple, un personnel administratif, un professionnel responsable de la structure, un membre du secrétariat, etc.).</p>
          <p>MedLé est également accessible, en lecture seule (sans possibilité d’ajouter ou modifier des données), aux administrations et aux juridictions suivantes :</p>
          <ul>
            <li>Les ministères de la santé, de l&apos;intérieur, de la justice ainsi que d&apos;autres ministères le cas échéant</li>
            <li>Les ARS</li>
            <li>Les cours d&apos;appel (CA)</li>
            <li>Les tribunaux judiciaires (TJ)</li>
          </ul>

          <h2>A quoi sert Medlé ?</h2>
          <p>MedLé est la plateforme de suivi national de l&apos;activité des structures de médecine légale. Elle permet de recenser toute l&apos;activité d’une structure et d’en déclarer les ETP aux ministères de la santé et de la justice. MedLé permet également de suivre, via un tableau de bord, l&apos;activité d’une UMJ/IML ainsi que l&apos;activité nationale (agrégation des données des 47 structures).</p>
          <p>MedLé remplace l&apos;Observatoire national de la médecine légale (ONML), utilisé jusqu’en 2020.</p>

          <h2>Qu&apos;entend-on par « schéma directeur de la médecine légale » ?</h2>
          <p>Le schéma directeur de la médecine légale correspond à l’organisation de la médecine légale prévue par les <a href="https://www.justice.gouv.fr/sites/default/files/migrations/textes/art_pix/JUSD1033099C.pdf">circulaires du 27 décembre 2010</a> et du <a href="https://www.justice.gouv.fr/sites/default/files/migrations/textes/art_pix/JUSD1221959C.pdf">25 avril 2012 relatives à l’organisation de la réforme de la médecine légale.</a></p>
          <p>Ces circulaires fixent :</p>
          <ul>
            <li>Pour chaque ressort de cour d’appel, les structures (UMJ et IML) auxquelles doivent être adressées les réquisitions judiciaires</li>
            <li>La liste des actes qui peuvent être effectuées sur réquisition judiciaire par une structure de médecine légale</li>
          </ul>
          <p>Les niveaux d’organisation de chaque structure et les effectifs afférents sont fixés à <a href="https://www.justice.gouv.fr/sites/default/files/migrations/textes/art_pix/JUSD1221959C.pdf" >l&apos;annexe 2 de la circulaire interministérielle du 25 avril 2012.</a></p>

          <h1 id="comment-medle">Comment utiliser Medlé ?</h1>
          <h2>Comment me créer un compte ?</h2>
          <p>Toutes les demandes de création, modification ou suppression de compte doivent être envoyées par email à l&apos;adresse <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>.</p>
          <p>Il est préférable de préciser l&apos;établissement auquel vous êtes rattaché, votre adresse email (qui vous servira d&apos;identifiant) et l&apos;objet de votre utilisation : déclaration des actes, déclaration des ETP, lecture seule, etc.</p>

          <h2>Quels types d&apos;actes peut-on recenser ?</h2>
          <p>Tous les actes qui peuvent être réalisés dans le cadre de l’organisation du schéma directeur de la médecine légale sont listés dans MedLé, y compris les participations aux assises et aux reconstitutions.</p>
          <p>S&apos;ajoutent:</p>
          <ul>
            <li>Les examens de victimes sans dépôt de plainte (voir précisions ci-dessous : partie <a href="#act-med-leg-vivant">Précisions sur les actes de médecine légale du vivant</a>)</li>
            <li>Les examens réalisés à la demande de l&apos;OFPRA (voir précisions ci-dessous : <a href="#exam-real-demande-ofpra">Qu’est-ce que les examens réalisés à la demande exclusive de l&apos;OFPRA ?</a>)</li>
            <li>Les ivresses publiques et manifestes (IPM) (voir précisions ci-dessous : <a href="#profil-dans-liste">Pourquoi ce profil est-il indiqué dans la liste ?</a>).</li>
          </ul>
          <p>En fonction du type de personne examinée (victime vivante, gardé à vue (GAV), personne pour âge osseux (hors GAV), examen pour OFPRA, personne décédée, autre), vous pourrez déclarer les actes suivants :</p>
          <ul>
            <li>Somatique / Psychiatrique</li>
            <li>Scanner / Radiographie / Panoramique dentaire</li>
            <li>Examen externe / Levée de corps / Autopsie / Anthropologie / Odontologie.</li>
          </ul>

          <h2>Peut-on modifier ou supprimer un acte ?</h2>
          <p>Oui, vous pouvez modifier ou supprimer un acte. Pour cela, vous devez :</p>
          <ul>
            <li>Accéder à la liste des actes (menu «tous les actes» dans la colonne de gauche)</li>
            <li>Retrouver l’acte que vous souhaitez supprimer ou modifier (la barre de recherche se trouvant en haut de la page peut vous aider)</li>
            <li>Cliquer sur le lien «voir» qui se trouve en bout de ligne</li>
          </ul>
          <p>Vous arriverez sur le détail de l’acte en question : en bas de page, les boutons «modifier un acte» et «supprimer un acte» vous permettront d’effectuer ces actions.</p>

          <h2>À quel rythme doit-on remplir MedLé ?</h2>
          <p>Il est recommandé de remplir MedLé au fur et à mesure, plutôt qu’en une seule fois en fin de mois.</p>
          <p>Pour information, le temps moyen constaté de remplissage est de 50 secondes par actes.</p>

          <h1 id="comment-act">Comment ajouter un acte ?</h1>
          <h2>Numéro de dossier interne : que faire si mon service n’en a pas ?</h2>
          <p>La case «numéro de dossier interne» est obligatoire dans l’ajout d’actes et doit être unique pour chaque acte. Ce numéro permet de différencier les personnes, à l’inverse d’un numéro de PV unique qui peut concerner une affaire avec plusieurs personnes. Le numéro de dossier interne permet également de donner un numéro aux réquisitions qui n’en comportent pas.</p>
          <p>Cependant, certains établissements n’ont pas de numéro de dossier interne. Si cela est votre cas, vous pouvez dans la case «numéro de dossier interne», au choix :</p>
          <ul>
            <li>Indiquer le numéro de PV ; celui-ci apparaître donc à la fois dans «numéro de dossier interne» et «numéro de PV».</li>
            <li>Créer un numéro à partir de la date du jour, par ex 20201201-1.</li>
            <li>Mettre en place un numéro de dossier interne dans votre service.</li>
          </ul>
          <p><u>Attention :</u> ne pas créer un numéro interne avec les initiales ou une partie des initiales du nom de la personne examinée.</p>

          <h2>Service demandeur : comment le trouver ? Que faire si je ne le trouve pas ?</h2>
          <p>Dans la case «Demandeur», commencez à saisir les premières lettres du demandeur recherché (généralement des commissariats de police, des brigades de gendarmerie, des tribunaux judiciaires, etc.). Automatiquement, MedLé affichera les premiers résultats correspondant à votre recherche. Vous n’aurez plus qu’à cliquer sur le demandeur recherché afin de le sélectionner.</p>
          <p>Quelques astuces :</p>
          <ul>
            <li>Il est préférable de saisir le nom d’une ville plutôt que les termes génériques «commissariats», «brigades», etc. qui retourneront de trop nombreux résultats</li>
            <li>Pour les villes avec des arrondissements (Paris, Marseille, Lyon, etc.) : saisissez le nom de la ville puis après un espace le numéro de l’arrondissement concerné (ex: Marseille 9)</li>
            <li>N’oubliez pas les tirets et les accents.</li>
          </ul>
          <p>Si malgré vos recherches, le demandeur que vous souhaitiez attribuer à l’acte déclaré n’apparaît pas dans la liste, contactez l’adresse <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a> en précisant l’intitulé du demandeur à ajouter dans la liste.</p>

          <p id="act-med-leg-vivant"><b>PRECISIONS SUR LES ACTES DE MEDECINE LEGALE DU VIVANT</b></p>
          <p><u>Que signifie la case à cocher «victime hors réquisition judiciaire (recueil de preuves sans plainte)» ?</u></p>
          <p>En 2021, les ministres chargés de la santé, de la justice et de l’intérieur ont co-signé une <a href="https://www.legifrance.gouv.fr/download/pdf/circ?id=45245">circulaire sur le déploiement des dispositifs d’accueil et d’accompagnement des victimes de violences conjugales, intrafamiliales et/ou sexuelles</a> au sein des établissements de santé publics ou privés.</p>
          <p>Désormais, les UMJ ont la possibilité de mettre en place le recueil de preuves sans dépôt de plainte.</p>
          <p>Concrètement, il s’agit d’une avancée permettant à une victime majeure de violence conjugale, sexuelle et/ou intrafamiliale de consulter un médecin légiste même si elle ne souhaite pas déposer plainte dans l’immédiat, donc hors réquisition judiciaire. Ce médecin l’examinera, établira un certificat médical et fera des prélèvements si nécessaires. Si la victime porte plainte, les preuves recueillies pourront être utilisées ultérieurement dans le cadre de la procédure judiciaire.</p>

          <h2>Dois-je enregistrer la prise en charge psychologique ?</h2>
          <p>La prise en charge psychologique des victimes, telle que prévue dans le cadre du schéma directeur et qui est financée par l’assurance maladie à hauteur d’un équivalent temps plein (ETP) par structure de médecine légale du vivant, ne fait pas l’objet d’un recensement dans MedLé.</p>
          <p><b>Victime : précisions sur la rubrique «Types de violence» (sous-rubriques «Nature» et «Contexte»)</b></p>
          <p>Pour les victimes, le type de violence doit être précisé pour chaque acte. Plusieurs choix sont possibles, vous pouvez donc cocher plusieurs cases à la fois dans «nature de la violence» et dans «contexte de la violence».</p>
          <p>Voici quelques précisions concernant les items listés dans la rubrique «Types de violence» :</p>
          <ul>
            <li>
              Sous-rubrique «Nature» :
              <p>Maltraitance : la maltraitance vise toute personne en situation de vulnérabilité lorsqu’un geste, une parole, une action ou un défaut d’action compromet ou porte atteinte à son développement, à ses droits, à ses besoins fondamentaux ou à sa santé et que cette atteinte intervient dans une relation de confiance, de dépendance, de soin ou d’accompagnement. Les situations de maltraitance peuvent être ponctuelles ou durables, intentionnelles ou non. Leur origine peut être individuelle, collective ou institutionnelle. Les violences et les négligences peuvent revêtir des formes multiples et associées au sein de ces situations (article L. 119-1 du code de l’action sociale et des familles et article l. 1431-2 du code de la santé publique).</p>
            </li>
            <li>
              Violences psychologiques :
              <p>cet onglet a été ajouté à la suite d’un cas concret dans une UMJ d’enlèvement et de séquestration sans coups et blessures. Dans ce
                7
                cas-là, il s’agit de violences psychologiques. Le harcèlement moral entre également dans cet item.</p>
            </li>
            <li>
              Sous-rubrique «Contexte» :
              <p>Institution : cette case est à cocher lorsque la victime était placée pendant les faits dans un établissement public ou privé, quelque soit le lieu (hôpital, EHPAD, foyer, etc.).</p>
            </li>
          </ul>
          <p>Afin d’illustrer cette rubrique, vous trouverez ci-dessous quelques exemples de combinaisons possibles :</p>
          <ul>
            <li>
              Pour un accident de la route :
              <ul>
                <li>Nature : accident non collectif</li>
                <li>Contexte : voie publique</li>
              </ul>
            </li>
            <li>
              Pour un policier se faisant agresser dans l’exercice de sa fonction :
              <ul>
                <li>Nature : coups et blessures</li>
                <li>Contexte : travail</li>
              </ul>
            </li>
            <li>
              Pour une personne âgée qui subit de la maltraitance en EHPAD (par exemple, des coups) :
              <ul>
                <li>Nature : maltraitance + coups et blessures voire harcèlement moral si vous le jugez utile</li>
                <li>Contexte : institution</li>
              </ul>
            </li>
            <li>
              Pour une personne en EHPAD qui est battue par son conjoint.e dans l’EHPAD :
              <ul>
                <li>Nature : coups et blessures</li>
                <li>Contexte : conjugale + institution</li>
              </ul>
            </li>
            <li>
              Pour une personne victime de coups et blessures et de violences sexuelles par son conjoint :
              <ul>
                <li>Nature : coups et blessures + sexuelle</li>
                <li>Contexte : conjugale</li>
              </ul>
            </li>
          </ul>
          <p><b>Comment faire si deux examens doivent être réalisés pour une même personne avec une seule réquisition judiciaire (ex: examen de compatibilité GAV et examen en tant que victime) ?</b></p>
          <p>Il est nécessaire de noter 2 actes distincts dans MedLé, un en tant que gardé à vue, l’autre en tant que victime. Vous pourrez noter le même numéro de réquisition.</p>

          <h2>Comment enregistrer les demandes d’âge osseux ?</h2>
          <p>Il est possible de différencier les demandes d’âge osseux réalisées dans le cadre de la GAV et hors GAV.</p>
          <ul>
            <li>Lorsqu’un examen d’une personne en GAV est demandé sur réquisition judiciaire et qu’il est nécessaire de réaliser un examen radiologique pour déterminer l’âge de la personne, il faut sélectionner la rubrique «gardé à vue», puis dans la rubrique «examens complémentaires demandés» de cocher «imagerie».</li>
            <li>Lorsqu’une demande d’examen d’âge osseux est demandée hors GAV, alors dans MedLé il est nécessaire de sélectionner dans «qui a été examiné» : «Personne pour âge osseux (hors GAV)».</li>
          </ul>

          <h2>Qu’est-ce que l’examen médical d’une personne retenue (dans le menu déroulant «autre activité») ?</h2>
          <p>Un étranger peut être contrôlé directement par la police pour vérifier qu’il a bien un titre de séjour. Seul un officier de police judiciaire peut décider de la retenue d’un étranger sur le territoire national. Le procureur de la République est informé dès le début de la procédure.</p>
          <p>L’officier de police judiciaire informe aussitôt l’étranger du droit d’être examiné par un médecin désigné par l’officier de police judiciaire. Le médecin se prononce alors sur l’aptitude au maintien de la personne en retenue et procède à toutes constatations utiles.</p>
          <p>Les UMJ peuvent être requises dans ce cadre. La procédure est la même que pour la réquisition de tout acte de médecine légale.</p>

          <h2 id="profil-dans-liste">IPM (ivresse publique et manifeste) : pourquoi ce profil est-il indiqué dans la liste ?</h2>
          <p>Les examens d’ivresse publique et manifeste ne sont pas des actes de médecine légale, mais des actes sous la compétence du ministère de l’intérieur, et financés par le ministère de l’intérieur. Cependant, dans des cours d’appel comme celle de Paris, les autorités judiciaires et celles du ministère de l’intérieur (préfecture de police de Paris) ont signé des conventions pour que ces actes soient réalisés par les services de médecine légale, dans les locaux de police et de gendarmerie. C’est la raison pour laquelle il est nécessaire de les comptabiliser dans MedLé.</p>
          <p>Ces examens ne sont pas rémunérés - ni aux médecins qui les réalisent ni aux établissements de santé siège des structures.</p>

          <h2 id="exam-real-demande-ofpra">Qu’est-ce que les examens réalisés à la demande exclusive de l’OFPRA ?</h2>
          <p><a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000035468390">L’arrêté du 23 août 2017</a>, pris pour l’application des articles L. 723-5 et L. 752-3 du code de l’entrée et du séjour des étrangers et du droit d’asile (CESEDA), prévoit que les examens médicaux visant à constater l’absence de mutilation sexuelle dans le cadre de la procédure d’asile et du maintien de la protection soient réalisés au sein des UMJ.</p>
          <p>Ces examens visant à constater l’absence de mutilation sexuelle dans le cadre de la procédure d’asile et du maintien de la protection doivent être réalisés à la demande exclusive de l’OFPRA et concernent uniquement les mineurs.</p>

          <h2>Qu’est-ce que les « examens liés à la route » ?</h2>
          <p>Les examens liés à la route prévus dans la <a href="https://affairesjuridiques.aphp.fr/textes/circulaire-du-25-avril-2012-relative-a-la-mise-en-oeuvre-de-la-reforme-de-la-medecine-legale/">circulaire interministérielle du 25 avril 2012</a> sont les examens cliniques et les prélèvements biologiques exécutés sur réquisitions judiciaires en application des articles <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038312018/2019-03-25">L. 234-4</a> et <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038311991">L. 235-2 (4ème alinéa)</a> du code de la route, dans le cadre de la suspicion d’un état alcoolique ou de l’usage de stupéfiants.</p>

          <h2>Comment définir un accident collectif ?</h2>
          <p>Extrait du guide méthodologique de novembre 2017 sur «La prise en charge des victimes d’accidents collectifs» :</p>
          <p><i>« Il s’agit d’un événement soudain provoquant directement ou indirectement des dommages humains ou matériels à l’égard <u>de nombreuses victimes</u>. Pouvant avoir pour origine ou pour facteur contributif une intervention ou une abstention humaine susceptible de recevoir une qualification pénale, cet événement nécessite, par son ampleur ou son impact, la mise en oeuvre de moyens importants et de mesures spécifiques pour la prise en charge des victimes, ainsi qu’une coordination des interventions et des accompagnements déployés. »</i></p>
          <p>Il est donc à distinguer d’un accident de la route.</p>
          <p><b><u>PRECISIONS SUR LES ACTES DE THANATOLOGIE</u></b></p>
          <p><b>Autopsie</b></p>
          <p>Lorsque les autopsies sont réalisées par deux médecins légistes, il est impératif de notifier un seul acte dans MedLé.</p>
          <p><b>Levée de corps et autopsie</b></p>
          <p>Si une levée de corps est suivie d’une autopsie, il est nécessaire de noter 2 actes (1 levée de corps + 1 autopsie).</p>
          <p><b>Levée de corps : quelle distance indiquer ?</b></p>
          <p>Vous devez prendre en compte la distance entre l’UMJ ou l’IML et le lieu d’intervention (et donc ne pas compter l’aller-retour).</p>
          <p><b>Examen externe de corps et autopsie</b></p>
          <p>Dans le cas où l’examen de corps est indépendant d’une autopsie réalisé dans un second temps, il est nécessaire de noter 2 actes.</p>
          <p><b><u>ASSISES ET RECONSTITUTION</u></b></p>
          <p><b>Durée : comment comptabiliser la durée de mobilisation ?</b></p>
          <p>Le temps de mobilisation comprend le temps de déplacement (aller/retour), temps de présence et temps de rédaction du rapport.</p>
          <p><b>Distance : quelle distance indiquer ?</b></p>
          <p>Vous devez prendre en compte la distance entre l’UMJ ou l’IML et le lieu d’intervention <b>(et donc ne pas compter l’aller-retour)</b>.</p>
          <p><b>Assises et reconstitutions à noter dans MedLé</b></p>
          <p>Seules les assises et les reconstitutions qui font suite à des actes réalisés par la structure (UMJ-IML) sur réquisition judiciaire sont à noter dans MedLé.</p>
          <p><b><u>PRECISIONS SUR LES PRÉLÈVEMENTS ET EXAMENS COMPLÉMENTAIRES</u></b></p>
          <p><b>De quoi s’agit-il exactement ?</b></p>
          <p>Il s’agit des prélèvements et des examens demandés sur réquisition judiciaire, comme les examens biologiques ou toxicologiques.</p>
          <p>Il n’est pas nécessaire d’inscrire le nombre d’examens complémentaires. Vous pouvez cliquer sur une ou plusieurs propositions, sans indiquer le nombre.</p>
          <p><b><u>HORAIRE DE L’EXAMEN</u></b></p>
          <p><b>Quelle heure indiquer ?</b></p>
          <p>L’heure à indiquer est celle du début de l’acte.</p>

          <h1 id="comment-stats">Comment consulter les statistiques ?</h1>
          <h2>Comment faire pour visualiser les données seulement sur une journée ?</h2>
          <p>En mettant la même date dans la case «date de début» et «date de fin», vous afficherez les statistiques sur une journée.</p>

          <h2>Comment consulter les statistiques au niveau national ?</h2>
          <p>En haut à droite de l’écran, vous trouverez un bouton indiquant «Votre structure» à gauche et «National» à droite. Lorsque vous cliquez dessus, le périmètre change et les données sont mises à jour dans chaque case automatiquement.</p>

          <h2>Comment faire si je souhaite faire des analyses avec des paramètres qui ne sont pas prévus dans l’onglet « statistiques » ?</h2>
          <p>Dans l’onglet « tous les actes », vous pouvez effectuer une recherche d’actes par date et par type d’examens. En bas de la page, vous avez la possibilité de cliquer sur « exporter » afin de disposer de la liste des actes dans un tableur. Vous pouvez ensuite procéder à des analyses statistiques grâce aux outils du tableur (par exemple : tri, filtre, utilisation de formules, etc.).</p>

          <h1 id="comment-employe">Comment déclarer le personnel employé ?</h1>
          <h2>ETP : de quoi parle-t-on ?</h2>
          <p>Il s’agit des équivalents temps plein (ETP) qui travaillent effectivement dans la structure, et non le nombre de personnes employées. Par exemple, 2 médecins peuvent travailler chacun à mi-temps, mais il s’agit au total d’un seul ETP.</p>
          <p>À noter que dans MedLé, vous déclarez le nombre total d’ETP par catégorie professionnelle pour l’UMJ et l’IML confondus.</p>
          <p><b>Attention : </b>Les internes en médecine, les élèves infirmiers, l’ETP de psychologue attribué dans le cadre de la réforme de la médecine légale (rémunéré par l’assurance maladie) ou autres ne doivent pas être inscrits dans les effectifs de MedLé.</p>

          <h2>Profils particuliers :</h2>
          <ul>
            <li>«Personnel autre» : dans le cadre de la réforme de la médecine légale en 2010, il est apparu que dans certaines structures, il existait soit du temps d’aide-soignant, soit de cadre de soins, etc. alloués au service. Il a donc été décidé de nommer un «personnel autre» dont le coût a été calculé (coût 2009) à partir 1/2 temps d’aide-soignant + 1/2 temps de cadre infirmier, soit 57 978,00 € (charges d’infrastructures de 20% comprises).</li>
            <li>Psychologue : l’ETP de psychologue financé par l’Assurance Maladie dans le cadre de la réforme de la médecine légale de 2010 à raison d’1 ETP par structure, n’entre pas dans les effectifs consignés dans MedLé.</li>
          </ul>

          <h2>Qui doit remplir cette rubrique ?</h2>
          <p>De préférence, les ETP doivent être remplis par les services administratifs des directions des établissements de santé siège de structure (Direction des Ressources Humaines, Direction des Affaires Médicales, etc.) et non par le responsable de l’UMJ/IML.</p>

          <h2>À quel rythme remplir cette rubrique ?</h2>
          <p>Le remplissage doit être fait à chaque fin de mois, avant le 5 du mois suivant.</p>
          <p>Par ailleurs, tous les ETP de l’année doivent obligatoirement être renseignés en janvier de l’année N+1 (par exemple, les ETP de l’année 2021 doivent être complets en janvier 2022).</p>

          <h1>Je ne trouve pas de réponse à ma question : à qui m’adresser ?</h1>
          <p>Pour toute question ou suggestion, merci d’adresser votre demande à l’adresse email <a href="mailto:contact-medle@sante.gouv.fr">contact-medle@sante.gouv.fr</a>.</p>
        </div>
      </Layout>

      <style jsx>{`
        .faq {
          max-width: 900px;
          margin: 0 auto;
        }

        h2 {
          color: #000091;
        }

        p>b>u {
          font-size: 1.25rem;
        }
      `}</style>
    </>
  )
}

export default withAuthentication(FaqPage, ADMIN)
