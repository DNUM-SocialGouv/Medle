exports.up = `
    create view "acts_by_day" as
        select date_trunc('day', acts.created_at)::date as day, name,
        hospitals.id as hospital_id,
        case
           when profile = 'Personne décédée' then 'Personne décédée'
           when profile = 'Autre activité/Assises' then 'Autre activité/Assises'
           when profile = 'Autre activité/Reconstitution' then 'Autre activité/Reconstitution'
           else 'Vivant' end as type,
        count(*) as nb_acts
        from acts
           inner join hospitals on acts.hospital_id = hospitals.id
        where acts.deleted_at is null
        group by day, name, hospitals.id, type
        order by day, name, hospitals.id, count(*) desc, type;
`

exports.down = `drop view "acts_by_day";`
