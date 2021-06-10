import * as yup from "yup"

import * as common from "./common"

const JStoDBKeys = {
  id: "id",
  name: "name",
  year: "year",
}

const schema = yup.object().shape({
  id: yup.number().positive().integer().nullable(),
  name: yup.string(),
  year: yup.number().positive().integer(),
})

export const { transform, transformAll, untransform, validate } = common.build({ JStoDBKeys, schema })
