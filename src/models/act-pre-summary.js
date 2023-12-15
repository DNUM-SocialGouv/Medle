import moment from "moment"

import { ISO_DATE } from "../utils/date"

// from Knex entity to model (JS) entity
export const transform = (knexData) => {
    return !knexData
        ? null
        : {
            examinationDate: moment(knexData.examination_date).format(ISO_DATE),
            hospital: { id: knexData.hospital_id, name: knexData.hospital_name },
            examined: knexData.examined,
            actType: knexData.actType,
            violenceType: knexData.violenceType,
            location: knexData.location,
            age: knexData.age,
            actDuration: knexData.actDuration,
            category: knexData.category,
            ponderation: knexData.ponderation,
            id: knexData.id,
            user: {
                email: knexData.user_email,
                firstName: knexData.user_first_name,
                id: knexData.added_by,
                lastName: knexData.user_last_name,
            },
        }
}

export const transformAll = (list) => list.map((knexData) => transform(knexData))

// from model (JS) entity to Knex entity
export const untransform = (model) => {
    const knexData = { extra_data: {} }

    const mainKeys = {
        id: "id",
        examinationDate: "examination_date",
        category: "category",
        examined: "examined",
        actType: "act_type",
        violenceType: "violence_type",
        location: "location",
        age: "age",
        actDuration: "act_duration",
        ponderation: "ponderation",
        hospitalId: "hospital_id",
        addedBy: "added_by",
    }

    Object.keys(model).forEach((key) => {
        if (mainKeys[key]) {
            knexData[mainKeys[key]] = model[key]
        } else {
            knexData.extra_data[key] = model[key]
        }
    })

    return knexData
}
