import * as yup from "yup"

import * as common from "./common"

// Mapping keys from JS model to DB model
const JStoDBKeys = {
  id: "id",
  finesseNumber: "finesse_number",
  name: "name",
  addr1: "addr1",
  addr2: "addr2",
  town: "town",
  depCode: "dep_code",
  postalCode: "postal_code",
}

const schema = yup.object().shape({
  id: yup.number().positive().integer().nullable(),
  finesseNumber: yup.string(),
  name: yup.string(),
  category: yup.string(),
  addr1: yup.string(),
  addr2: yup.string(),
  town: yup.string(),
  depCode: yup.string().matches(/[0-9]{2,3}/),
  postalCode: yup.string().matches(/^$|[0-9]{5}/),
})

export const { transform, transformAll, untransform, validate } = common.build({ JStoDBKeys, schema })
