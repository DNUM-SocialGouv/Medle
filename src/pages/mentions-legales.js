import Head from "next/head";
import Layout from "../components/Layout";
import { Title1 } from "../components/StyledComponents";
import { useUser } from "../hooks/useUser";

export default function MentionsLegales() {
  const currentUser = useUser();

  return (
    <>
      <Layout page="mentions-legales" currentUser={currentUser}>
        <Head>
          <title>Mentions légales - Medlé</title>
        </Head>

        <Title1 className="mt-5 mb-4">Mentions légales</Title1>

        <div className="mentions-legales mt-5">
          <h2>Éditeur de la plateforme</h2>
          <p>Direction générale de l’offre de soins (DGOS)
            <br />
            14 avenue Duquesne
            <br />
            75007 Paris</p>

          <h2>Directeur de la publication</h2>
          <p>Madame Cécile LAMBERT, Directrice générale de l’offre de soins (DGOS) par intérim.</p>

          <h2>Hébergement de la plateforme</h2>
          <p>Cette plateforme est hébergée par :</p>
          <p>Cegedim S.A
            <br />137 rue d’Aguesseau
            <br />
            92100 Boulogne-Billancourt</p>

          <h2>Accessibilité</h2>
          <p>La conformité aux normes d’accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre ce site accessible à toutes et à tous.</p>

          <h2>Signaler un dysfonctionnement</h2>
          <p>Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du site, merci de nous en faire part. Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.</p>

          <h2>Responsabilités</h2>

          <h3>L’éditeur de la « Plateforme MEDLÉ » :</h3>
          <p>Les sources des informations diffusées sur la Plateforme sont réputées fiables mais le site ne garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions</p>
          <p>L’éditeur s’autorise à suspendre ou révoquer n&apos;importe quel compte et toutes les actions réalisées par ce biais, s’il estime que l’usage réalisé du service porte préjudice à son image ou ne correspond pas aux exigences de sécurité.</p>
          <p>L’éditeur s’engage à la sécurisation de la Plateforme, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité et la confidentialité des informations fournies.</p>
          <p>L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie financière, à la Plateforme. Il se réserve la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, la plateforme pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.</p>

          <h3>L’Utilisateur :</h3>
          <p>L&apos;Utilisateur s&apos;assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa forme, est interdite. Il assume les risques liés à l&apos;utilisation de son identifiant et mot de passe.</p>
          <p>Il s&apos;engage à ne pas commercialiser les données reçues et à ne pas les communiquer à des tiers en dehors des cas prévus par la loi.</p>
          <p>Toute information transmise par l&apos;Utilisateur est de sa seule responsabilité. Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du code pénal, prévoyant des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.</p>
          <p>L&apos;Utilisateur s&apos;engage à ne pas mettre en ligne de contenus ou informations contraires aux dispositions légales et réglementaires en vigueur.</p>
          <p>Le contenu de l&apos;Utilisateur peut être à tout moment et pour n&apos;importe quelle raison supprimé ou modifié par le site, sans préavis.</p>

          <h3>Mise à jour des conditions d’utilisation :</h3>
          <p>Les termes des présentes conditions d’utilisation peuvent être amendés à tout moment, sans préavis, en fonction des modifications apportées à la plateforme, de l’évolution de la législation ou pour tout autre motif jugé nécessaire.</p>
        </div>
      </Layout>

      <style jsx>{`
        .mentions-legales {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}
