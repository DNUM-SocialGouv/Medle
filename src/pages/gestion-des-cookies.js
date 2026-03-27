import Head from "next/head";
import Layout from "../components/Layout";
import { Title1 } from "../components/StyledComponents";
import { useUser } from "../hooks/useUser";

export default function GestionDesCookies() {
  const currentUser = useUser();

  return (
    <>
      <Layout page="gestion-des-cookies" currentUser={currentUser}>
        <Head>
          <title>Traitement des données à caractère personnel</title>
        </Head>

        <Title1 className="mt-5 mb-4">Gestion des cookies</Title1>

        <div className="gestion-des-cookies mt-5">
          <p>En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le traitement
            des données à caractère personnel et la protection de la vie privée dans le secteur des
            communications électroniques, transposée à l’article 82 de la loi n°78-17 du 6 janvier 1978
            relative à l’informatique, aux fichiers et aux libertés, les traceurs ou cookies suivent deux
            régimes distincts.</p>
          <p>Les cookies strictement nécessaires au service, ceux de publicité non personnalisée ou
            ayant pour finalité exclusive de faciliter la communication par voie électronique sont
            dispensés de consentement préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier
            1978.</p>
          <p>Les autres cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour
            finalité exclusive de faciliter la communication par voie électronique doivent être consenti
            par l’utilisateur.</p>
          <p>Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques
            constitue une base légale au sens du RGPD et doit être entendu au sens de l&apos;article 6-a du
            Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la
            protection des personnes physiques à l&apos;égard du traitement des données à caractère
            personnel et à la libre circulation de ces données.</p>

          <h1>Durée de conservation des cookies</h1>
          <p><strong className="fr-text--bold">Dès le retrait du consentement ou dans un délai de 13 mois</strong>, conformément aux
            recommandations de la CNIL</p>

          <h2>Cookies</h2>
          <p>Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de
            collecter des informations relatives à votre navigation et de vous adresser des services
            adaptés à votre terminal (ordinateur, mobile ou tablette).</p>
          <p>Le site dépose des cookies de mesure d’audience (nombre de visites, pages consultées),
            respectant les conditions d’exemption du consentement de l’internaute définies par la
            recommandation « Cookies » de la Commission nationale informatique et libertés (CNIL).
            Cela signifie, notamment, que ces cookies ne servent qu’à la production de statistiques
            anonymes et ne permettent pas de suivre la navigation de l’internaute sur d’autres sites.</p>
          <p><strong className="fr-text--bold">Nous utilisons pour cela Matomo</strong>, un outil de mesure d’audience web libre, paramétré
            pour être en conformité avec la recommandation « Cookies » de la CNIL. Cela signifie que
            votre adresse IP, par exemple, est anonymisée avant d’être enregistrée. Il est donc
            impossible d’associer vos visites sur ce site à votre personne.</p>
          <p>Il convient d’indiquer que les cookies ne permettent pas de suivre la navigation de
            l’internaute sur d’autres sites</p>
          <p>À tout moment, vous pouvez refuser l’utilisation des cookies et désactiver le dépôt sur votre
            ordinateur en utilisant la fonction dédiée de votre navigateur (fonction disponible
            notamment sur Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari
            et Opera).</p>
          <p>Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale
            de l&apos;Informatique et des Libertés (CNIL) :</p>
          <ul>
            <li><a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi">Cookies & traceurs: que dit la loi ?</a></li>
            <li><a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur">Cookies : les outils pour les maîtriser</a></li>
          </ul>
        </div>
      </Layout>

      <style jsx>{`
        .gestion-des-cookies {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}
