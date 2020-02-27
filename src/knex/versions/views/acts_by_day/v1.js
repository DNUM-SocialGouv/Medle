exports.up = `
    create view "acts_by_day" as
        select date_trunc('day', acts.created_at)::date as day, name,
                hospitals.id as hospital_id,
                count(*) as nb_acts
        from acts
        inner join hospitals on acts.hospital_id = hospitals.id
        where acts.deleted_at is null
        group by 1, 2, 3
        order by 1, 2
`

exports.down = `drop view "acts_by_day";`
