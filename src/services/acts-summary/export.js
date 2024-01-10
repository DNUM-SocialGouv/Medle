import Excel from "exceljs"

import { now } from "../../utils/date"
import { searchForExport } from "./search"

async function modifyBorders(worksheet, startRow, endRow, startCol, endCol, borderConfig) {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = borderConfig;
      cell.alignment = { horizontal: "center", vertical: "middle" }
    }
  }
}

export const exportSummary = async (params, currentUser, headers) => {
  const { elements } = await searchForExport(params, currentUser, headers)
  const workbook = new Excel.Workbook()

  workbook.created = now()
  workbook.modified = now()

  const worksheet = workbook.addWorksheet("Synthèse de l'activité")
  worksheet.properties.defaultRowHeight = 40;

  worksheet.columns = [
    "",
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ].map((month) => ({ header: month, key: month.charAt(0).toLowerCase() + month.slice(1), width: 12 }))

  // Add table 1 row
  const table1row = Object.values(elements.differences[params.year])
  table1row.unshift("Adéquation de la charge et de la capacité de travail (en jours)")
  worksheet.addRow(table1row)

  worksheet.addRow({})

  // Add table 2 row
  const table2row = Object.values(elements.medicalSummaryByYear[params.year])
  table2row.unshift("Capacité à fournir")
  worksheet.addRow(table2row)

  worksheet.addRow({})
// Add table 3 rows
  const table3row = Object.values(elements.totalSummaryAct[params.year])
  table3row.unshift("Charge totale de travail")
  worksheet.addRow(table3row)
  elements.hospitalSummaryByYear.forEach(element => {
    const summary = Object.values(element.summary)
    summary.unshift(element.category)
    if (summary) worksheet.addRow(summary)
  });

  worksheet.getColumn(1).width = 30;

  // add styles
  const borderConfig = {
    top: { style: 'medium' },
    bottom: { style: 'medium' },
    left: { style: 'medium' },
    right: { style: 'medium' },
  };

  await modifyBorders(worksheet, 2, 2, 1, 13, borderConfig);
  await modifyBorders(worksheet, 4, 4, 1, 13, borderConfig);
  await modifyBorders(worksheet, 6, 13, 1, 13, borderConfig);
  worksheet.getColumn(1).alignment = { wrapText: true, vertical: "middle", horizontal: "center" };

  return workbook
}
