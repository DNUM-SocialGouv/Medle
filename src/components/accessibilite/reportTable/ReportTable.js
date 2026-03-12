import Total from "./Total";
import Consultation from "./Consultation";
import Cadres from "./Cadres";
import Couleurs from "./Couleurs";
import ElementsObligatoires from "./ElementsObligatoires";
import Formulaires from "./Formulaires";
import Images from "./Images";
import Liens from "./Liens";
import Multimedia from "./Multimedia";
import Navigation from "./Navigation";
import PresentationDeLinformation from "./PresentationDeLinformation";
import Scripts from "./Scripts";
import StructurationDeLinformation from "./StructurationDeLinformation";
import Tableaux from "./Tableaux";

export default function ReportTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>N° crit.</th>
          <th>Thématique / intitulé du critère</th>
          <th>Connexion</th>
          <th>Accueil avec graphiques</th>
          <th>Tous les actes</th>
          <th>Ajout utilisateur</th>
          <th>Détails utilisateur</th>
          <th>Saisie ETP</th>
          <th>Ajout acte</th>
          <th>Mentions légales</th>
          <th>FAQ</th>
          <th>Plan de site</th>
          <th>C</th>
          <th>NC</th>
          <th>NA</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <Images />
        <Cadres />
        <Couleurs />
        <Multimedia />
        <Tableaux />
        <Liens />
        <Scripts />
        <ElementsObligatoires />
        <StructurationDeLinformation />
        <PresentationDeLinformation />
        <Formulaires />
        <Navigation />
        <Consultation />
        <Total />
      </tbody>
    </table>
  );
}
