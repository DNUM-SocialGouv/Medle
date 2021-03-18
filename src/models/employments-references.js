import * as yup from "yup"

import * as common from "./common"

const JStoDBKeys = {
  hospitalId: "hospital_id",
  id: "id",
  month: "month",
  reference: "reference",
  year: "year",
}

const schema = yup.object().shape({
  hospitalId: yup.number().positive().integer(),
  id: yup.number().positive().integer().nullable(),
  month: yup.string().length(2),
  reference: yup.object(),
  year: yup.number().positive().integer(),
})

export const { transform, transformAll, untransform, untransformAll, validate } = common.build({ JStoDBKeys, schema })
