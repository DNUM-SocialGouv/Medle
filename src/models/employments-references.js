import * as yup from "yup"
import * as common from "./common"

const JStoDBKeys = {
  id: "id",
  hospitalId: "hospital_id",
  year: "year",
  month: "month",
  reference: "reference",
}

const schema = yup.object().shape({
  id: yup.number().positive().integer().nullable(),
  hospitalId: yup.number().positive().integer(),
  year: yup.number().positive().integer(),
  month: yup.string().length(2),
  reference: yup.string(),
})

export const { transform, transformAll, untransform, untransformAll, validate } = common.build({ JStoDBKeys, schema })
