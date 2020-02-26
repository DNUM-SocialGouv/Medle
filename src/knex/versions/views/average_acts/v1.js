exports.up = `
    create view "average_acts" as
        with acts_by_day as (
            select date_trunc('day', acts.created_at)::date, name,
                    hospitals.id as hospital_id,
                    count(*) as nb_acts
            from acts
            inner join hospitals on acts.hospital_id = hospitals.id
            where acts.deleted_at is null
            group by 1, 2, 3
            order by 1, 2
        )
        select name,
                hospital_id,
                avg(nb_acts)::integer as average
        from acts_by_day
        group by name, hospital_id
        order by average desc;
`

exports.down = `drop view "average_acts";`
