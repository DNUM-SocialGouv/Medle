import * as yup from "yup"

import * as common from "./common"

const JStoDBKeys = {
    id: "id",
    category: "category",
    examined: "examined",
    actType: "act_type",
    violenceType: "violence_type",
    actDuration: "act_duration",
    ponderation: "ponderation",
}

const schema = yup.object().shape({
    id: yup.number().positive().integer().nullable(),
    category: yup.string(),
    examined: yup.string(),
    actType: yup.string(),
    violenceType: yup.string(),
    actDuration: yup.number().positive(),
    ponderation: yup.float(),
})

export const { transform, transformAll, untransform, validate } = common.build({ JStoDBKeys, schema })


