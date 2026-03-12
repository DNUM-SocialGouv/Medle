import styles from "./ReportTable.module.css";

export default function Couleurs() {
  return (
    <>
      <tr>
        <td>Couleurs</td>
      </tr>
      <tr>
        <td>3.1</td>
        <td>Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td className={styles["background-ok"]}>Conforme</td>
        <td>9</td>
        <td>1</td>
        <td>0</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>3.2</td>
        <td>Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?</td>
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
        <td>3.3</td>
        <td>Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?</td>
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
    </>
  );
}
