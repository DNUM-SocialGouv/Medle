import * as yup from "yup"

import { LIMIT_EXPORT } from "../../config"
import knex from "../../knex/knex"
import { normalize } from "../normalize"
import { APIError } from "../../utils/errors"
import { STATUS_406_NOT_ACCEPTABLE } from "../../utils/http"
import { findEmploymentsByHospitalId } from "../../clients/employments"

const LIMIT = 50

const monthsOfYear = [
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
]

export const makeWhereClause = ({
  scope,
  hospitals,
}) => (builder) => {
  let queriedHospitals = []

  if (hospitals?.length) {
    // For valid hospital filter, filter on it
    queriedHospitals = hospitals
  } else if (scope?.length) {
    // Otherwise, for scoped user, filter on his scope
    queriedHospitals = scope
  }
  // Otherwise, do not filter at all

  if (queriedHospitals?.length) {
    builder.where(
      knex.raw("act_summary.hospital_id in (" + queriedHospitals.map(() => "?").join(",") + ")", [...queriedHospitals]),
    )
  }
}

const searchSchema = yup.object().shape({
  currentUser: yup.object(),
  hospitals: yup.array().of(yup.number().positive().integer()),
  requestedPage: yup.number().integer().positive(),
})

export const normalizeParams = async (params, currentUser) => {
  // Wrap supposed array fields with array litteral syntax for yup try to cast
  params.hospitals = params.hospitals ? params.hospitals.split(",").map(Number) : []
  params.scope = currentUser?.scope || []
  if (currentUser?.hospital?.id) params.scope = [...params.scope, currentUser.hospital.id]

  // For user having a scope (non super admin, non national user), then restrict potentially their hospital filter
  if (params.hospitals?.length && params.scope?.length) {
    params.hospitals = params.hospitals.filter((hospital) => params.scope.includes(hospital))
  }

  return normalize(searchSchema)(params)
}

export const search = async (params, currentUser) => {
  params = await normalizeParams(params, currentUser)
  const [actsCount] = await knex("act_summary").where(makeWhereClause(params)).count()

  const totalCount = parseInt(actsCount.count, 10)
  const maxPage = Math.ceil(totalCount / LIMIT)

  let { requestedPage } = params

  // set default to 1 if not correct or too little, set default to maxPage if too big
  requestedPage =
    !requestedPage || isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage > maxPage ? maxPage : requestedPage

  const offset = (requestedPage - 1) * LIMIT

  // SQL query
  const actsSummary = await knex("act_summary")
    .where(makeWhereClause(params))
    .limit(LIMIT)
    .offset(offset)
    .select("*")

  const filteredArray = actsSummary
    .map((item) => {
      const { summary } = item;
      const filteredSummary = Object.fromEntries(
        Object.entries(summary).filter(([year, months]) =>
          Object.values(months).some((value) => value !== 0)
        )
      );
      return { ...item, summary: filteredSummary };
    })
    .filter((item) => {
      const { summary } = item;
      return Object.values(summary).some((months) =>
        Object.values(months).some((value) => value !== 0)
      );
    });

  return { byPage: LIMIT, currentPage: requestedPage, elements: filteredArray, maxPage, totalCount }
}

export const searchForExport = async (params, currentUser, headers) => {
  params = await normalizeParams(params, currentUser)

  const medicalSummary = await findEmploymentsByHospitalId({ hospitalId: params.hospitals, headers })

  const [actsCount] = await knex("act_summary").where(makeWhereClause(params)).count()

  const count = actsCount?.count

  // Limit the number of lines in export feature for security reason.
  if (count && count > LIMIT_EXPORT)
    throw new APIError({
      message: `Too many rows (limit is ${LIMIT_EXPORT})`,
      status: STATUS_406_NOT_ACCEPTABLE,
    })
  const actsSummary = await knex("act_summary")
    .where(makeWhereClause(params))
    .limit(LIMIT)
    .select("*")

  const hospitalSummary = actsSummary
    .map((item) => {
      const { summary } = item;
      const filteredSummary = Object.fromEntries(
        Object.entries(summary).filter(([year, months]) =>
          Object.values(months).some((value) => value !== 0)
        )
      );
      return { ...item, summary: filteredSummary };
    })
    .filter((item) => {
      const { summary } = item;
      return Object.values(summary).some((months) =>
        Object.values(months).some((value) => value !== 0)
      );
    });

  function calculateSummaryValue(hospitalSummary, year, month) {
    let sum = 0;

    for (const obj of hospitalSummary) {
      if (obj.summary && obj.summary[year] && obj.summary[year][month] !== undefined) {
        sum += parseFloat(obj.summary[year][month]) || 0;
      }
    }

    return sum;
  }
  function calculateDifferencesByYearOrdered(medicalSummary, hospitalSummary) {
    const result = {};
    const totalSummaryAct = {};
    const formattedMedicalSummary = {};

    const differencesByMonth = monthsOfYear.map((month) => month.charAt(0).toLowerCase() + month.slice(1)).map((month) => {
      const medicalSummaryByMonth = Math.round(medicalSummary[params.year][month]) || 0;
      const hospitalSummaryBymonth = calculateSummaryValue(hospitalSummary, params.year, month);

      if (!totalSummaryAct[params.year]) {
        totalSummaryAct[params.year] = {};
      }
      if (!formattedMedicalSummary[params.year]) {
        formattedMedicalSummary[params.year] = {};
      }
      totalSummaryAct[params.year][month] = hospitalSummaryBymonth;
      formattedMedicalSummary[params.year][month] = medicalSummaryByMonth;
      const difference = medicalSummaryByMonth - hospitalSummaryBymonth;
      return { month, difference };
    });

    result[params.year] = differencesByMonth.reduce((acc, curr) => {
      acc[curr.month] = Math.round(curr.difference);
      return acc;
    }, {});

    return { result, totalSummaryAct, formattedMedicalSummary };
  }

  const hospitalSummaryByYear = hospitalSummary.map(({ category, summary }) => ({ category, summary: summary[params.year] }))
    .filter((item) => item.summary)

  hospitalSummaryByYear.forEach(entry => {
    entry.summary = monthsOfYear.reduce((result, month) => {
      const formattedMonth = month.charAt(0).toLowerCase() + month.slice(1);
      result[formattedMonth] = entry.summary[formattedMonth] || 0;
      return result;
    }, {});
  });

  const { result: differences, totalSummaryAct, formattedMedicalSummary } = calculateDifferencesByYearOrdered(medicalSummary, hospitalSummary);

  return { elements: { differences, medicalSummaryByYear: formattedMedicalSummary, hospitalSummaryByYear, totalSummaryAct }, totalCount: count }
}
