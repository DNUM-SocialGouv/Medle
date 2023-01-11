import * as yup from "yup"

import * as common from "./common"

const JStoDBKeys = {
  id: "id",
  name: "name",
  depCode: "dep_code",
  type: "type",
}

const schema = yup.object().shape({
  id: yup.number().positive().integer().nullable(),
  name: yup.string(),
  depCode: yup
    .string()
    .matches(/^2A|2B|[0-9]{2,3}$/i)
    .nullable(),
  type: yup.string().nullable(),
})

export const { transform, transformAll, untransform, validate } = common.build({ JStoDBKeys, schema })
