const knexConfig = require("../../knexfile")

const environment = process.env.NODE_ENV || "development"

const knex = require("knex")(knexConfig[environment])

exports.initPreSummaryActivity = async () => {
    try {
        return await new Promise(async (resolve, reject) => {
            try {
                await knex("act_pre_summary").delete()
                const stream = await knex("acts")
                    .select(
                        "examination_date",
                        "profile as examined",
                        "added_by",
                        "hospital_id",
                        knex.raw("extra_data->>'examinationTypes' as act_type"),
                        knex.raw("extra_data->>'personAgeTag' as age"),
                        knex.raw("extra_data->>'violenceNatures' as violence_type"),
                        knex.raw("extra_data->>'location' as location"),
                    ).stream()

                let rowsToInsert = [];
                const batchSize = 2000;
                let count = 0;

                const summaryActParameters = await knex("act_summary_parameters").select('*')

                stream.on('data', function (act) {
                    const examined = act.examined;
                    const actTypeMatch = act.act_type?.match(/"(.*?)"/);
                    const actType = actTypeMatch ? actTypeMatch[1] || '' : '';

                    const violenceTypeMatch = act.violence_type?.match(/"(.*?)"/);
                    const violenceType = violenceTypeMatch ? violenceTypeMatch[1] || '' : '';
                    const age = act.age;
                    const location = act.location;

                    // Creating the category by concatenating fields
                    const category = `${examined} - ${actType} - ${violenceType}`;

                    // Find corresponding summary act parameter for each act
                    const correspondingSummaryActParameter = summaryActParameters.find((param) => param.category === category)
                    let ponderation = 1
                    if (correspondingSummaryActParameter) {
                        if (Object.keys(correspondingSummaryActParameter.ponderation.age) !== 0) {
                            ponderation = correspondingSummaryActParameter.ponderation.age[age]
                        } else if (Object.keys(correspondingSummaryActParameter.ponderation.location) !== 0) {
                            ponderation = correspondingSummaryActParameter.ponderation.location[location]
                        } else if (Object.keys(correspondingSummaryActParameter.ponderation.duration) !== 0) {
                            ponderation = correspondingSummaryActParameter.ponderation.duration[duration]
                        }
                    }

                    rowsToInsert.push({
                        ...act,
                        act_duration: correspondingSummaryActParameter?.act_duration * ponderation || 0,
                        ponderation,
                        category,
                        act_type: actType,
                        violence_type: violenceType
                    })

                    if (rowsToInsert.length >= batchSize) {
                        knex.batchInsert('act_pre_summary', rowsToInsert, batchSize)
                        console.log('Batch inserted into act_pre_summary table');
                        count = count + rowsToInsert.length
                        console.log(count)
                        rowsToInsert = []; // Clear the array
                    }
                })

                stream.on('end', function () {
                    if (rowsToInsert.length > 0) {
                        knex.batchInsert('act_pre_summary', rowsToInsert)
                            .then(async () => {
                                console.log('Final batch inserted into act_pre_summary table');
                                console.log(await knex('act_pre_summary').count())
                                resolve(knex);
                            })
                            .catch(error => {
                                console.error('Error inserting final batch:', error);
                                reject(error);
                            });
                    } else {
                        resolve(knex)
                    }

                });
                stream.on('error', function (error) {
                    console.error('Error streaming data:', error);
                    reject(error);
                });
            } catch (error) {
                console.error("Error summary activity", error)
                reject(error)
            }
        }).catch((error) => console.error("Error summary activity", error));
    } catch (e) {
        console.error("Error Prisma Crons summary activity :", e)
    } 
}
