import styles from "./ReportTable.module.css";

export default function Liens() {
  return (
    <>
      <tr>
        <td>Liens</td>
      </tr>
      <tr>
        <td>6.1</td>
        <td>Chaque lien est-il explicite (hors cas particuliers) ?</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td className={styles["background-error"]}>Non conforme</td>
        <td>0</td>
        <td>10</td>
        <td>0</td>
        <td className={styles["background-error"]}>Non conforme</td>
      </tr>
      <tr>
        <td>6.2</td>
        <td>Dans chaque page web, chaque lien a-t- il un intitulé ?</td>
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
  )
}
