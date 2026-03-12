import styles from "./ReportTable.module.css";

export default function Formulaires() {
  return (
    <>
      <tr>
        <td>Formulaires</td>
      </tr>
      <tr>
        <td>11.1</td>
        <td>Chaque champ de formulaire a-t-il une étiquette ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>3</td>
        <td>4</td>
        <td>3</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>11.2</td>
        <td>Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>7</td>
        <td>0</td>
        <td>3</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.3</td>
        <td>Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>3</td>
        <td>0</td>
        <td>7</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.4</td>
        <td>Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>7</td>
        <td>0</td>
        <td>3</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.5</td>
        <td>Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>1</td>
        <td>0</td>
        <td>9</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.6</td>
        <td>Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>1</td>
        <td>0</td>
        <td>9</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.7</td>
        <td>Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>1</td>
        <td>0</td>
        <td>9</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.8</td>
        <td>Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupées de manière pertinente ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>0</td>
        <td>0</td>
        <td>10</td>
        <td className={styles["background-warning"]}>Non applicable</td>
      </tr>
      <tr>
        <td>11.9</td>
        <td>Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td>1</td>
        <td>9</td>
        <td>0</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>11.10</td>
        <td>Dans chaque formulaire, le contrôle de saisie est- il utilisé de manière pertinente (hors cas particuliers) ?</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>0</td>
        <td>5</td>
        <td>5</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>11.11</td>
        <td>Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-error"]}>Non Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>2</td>
        <td>3</td>
        <td>5</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>11.12</td>
        <td>Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>4</td>
        <td>0</td>
        <td>6</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>11.13</td>
        <td>La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>0</td>
        <td>0</td>
        <td>10</td>
        <td className={styles["background-warning"]}>Non applicable</td>
      </tr>
    </>
  );
}
