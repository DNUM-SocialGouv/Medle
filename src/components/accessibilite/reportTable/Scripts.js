import styles from "./ReportTable.module.css";

export default function Scripts() {
  return (
    <>
      <tr>
        <td>Scripts</td>
      </tr>
      <tr>
        <td>7.1</td>
        <td>Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td>4</td>
        <td>6</td>
        <td>0</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>7.2</td>
        <td>Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?</td>
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
        <td>7.3</td>
        <td>Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td>10</td>
        <td>0</td>
        <td>0</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>7.4</td>
        <td>Pour chaque script qui initie un changement de contexte, l’utilisateur est-il averti ou en a-t-il le contrôle ?</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>2</td>
        <td>0</td>
        <td>8</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
      <tr>
        <td>7.5</td>
        <td>Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td className={styles["background-warning"]}>Non applicable</td>
        <td>5</td>
        <td>0</td>
        <td>5</td>
        <td className={styles["background-ok"]}>Conforme</td>
      </tr>
    </>
  );
}
