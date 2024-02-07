const knexConfig = require("../../knexfile");

const environment = process.env.NODE_ENV || "development";

const knex = require("knex")(knexConfig[environment]);

exports.initSummaryActivity = async () => {
    console.time('begin')
    try {
        await knex('act_summary').delete()
        const hospitalsWithActs = await knex('hospitals')
            .select(
                'hospitals.id as hospital_id',
                'subquery.act_category',
                knex.raw(
                    "jsonb_agg(jsonb_build_object('id_act', subquery.id_act, 'act_category', subquery.act_category, 'examination_date', subquery.examination_date, 'act_duration', subquery.act_duration )) as acts"
                )
            )
            .join(
                knex.raw(
                    `(SELECT act_pre_summary.hospital_id, act_pre_summary.id as id_act, act_pre_summary.category as act_category, act_pre_summary.examination_date, act_pre_summary.act_duration
        FROM act_pre_summary
        GROUP BY act_pre_summary.hospital_id, act_pre_summary.id, act_pre_summary.category
        ) as subquery`
                ),
                'hospitals.id',
                'subquery.hospital_id'
            )
            .groupBy('hospitals.id', 'subquery.act_category');

        const insertData = [];
        for (const hospital of hospitalsWithActs) {
            const hospitalActs = hospital.acts;
            const summary = {};

            for (const act of hospitalActs) {
                const year = new Date(act.examination_date).getFullYear();
                const month = new Date(act.examination_date).toLocaleString('fr-FR', { month: 'long' });

                if (!summary[year]) {
                    summary[year] = {};
                }

                if (!summary[year][month]) {
                    summary[year][month] = 0;
                }

                summary[year][month] += Math.round(act.act_duration / 24);
            }

            insertData.push({
                hospital_id: hospital.hospital_id,
                category: hospital.act_category,
                summary: JSON.stringify(summary)
            });
        }
        await knex.batchInsert('act_summary', insertData);

        console.timeEnd('begin')

        console.log('Act summary generation completed successfully.');
    } catch (error) {
        console.error('Error generating act summary:', error);
    }
};
