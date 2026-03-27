import styles from "./ReportTable.module.css";


export default function ReportTable() {
  return (
    <>
      <table className={styles["reportTable"]}>
        <thead>
          <tr>
            <th>Thématiques</th>
            <th>Conformes</th>
            <th>Non conformes</th>
            <th>Total des critères applicables</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 - Images</td>
            <td>2</td>
            <td>1</td>
            <td>3</td>
          </tr>
          <tr>
            <td>2 - Cadres</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>3 - Couleurs</td>
            <td>2</td>
            <td>1</td>
            <td>3</td>
          </tr>
          <tr>
            <td>4 - Multimédia</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>5 - Tableaux</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
          </tr>
          <tr>
            <td>6 - Liens</td>
            <td>1</td>
            <td>1</td>
            <td>2</td>
          </tr>
          <tr>
            <td>7 - Scripts</td>
            <td>3</td>
            <td>1</td>
            <td>4</td>
          </tr>
          <tr>
            <td>8 - Éléments obligatoires</td>
            <td>7</td>
            <td>0</td>
            <td>7</td>
          </tr>
          <tr>
            <td>9 - Structuration de l’information</td>
            <td>3</td>
            <td>0</td>
            <td>3</td>
          </tr>
          <tr>
            <td>10 - Présentation de l’information</td>
            <td>5</td>
            <td>5</td>
            <td>10</td>
          </tr>
          <tr>
            <td>11 - Formulaires</td>
            <td>7</td>
            <td>4</td>
            <td>11</td>
          </tr>
          <tr>
            <td>12 - Navigation</td>
            <td>7</td>
            <td>2</td>
            <td>9</td>
          </tr>
          <tr>
            <td>13 - Consultation</td>
            <td>6</td>
            <td>0</td>
            <td>6</td>
          </tr>
          <tr>
            <td>TOTAL</td>
            <td>45</td>
            <td>15</td>
            <td>60</td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className={styles["reportTable"]}>
        <tbody>
          <tr>
            <td>Taux de conformité par critère respecté</td>
            <td>75%</td>
          </tr>
          <tr>
            <td>Taux moyen de conformité</td>
            <td>85%</td>
          </tr>
        </tbody>
      </table>
      <br />
      <p>
        Le taux de conformité est calculé de la manière suivante :
        <br />
        (nombre de critères valides / (nombre de critères valides + nombre de critères invalides)) * 100.
        <br />
        D’autres méthodes de calcul existent, il n’est présent qu’à titre indicatif et n’est pas représentatif de l’impact en terme d’usage.
      </p>
    </>
  );
}
