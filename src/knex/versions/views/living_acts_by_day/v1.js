exports.up = `
    create view "living_acts_by_day" as
        select date_trunc('day', acts.created_at)::date as day,
               name,
               hospitals.id as hospital_id,
               count(*) as nb_acts
        from acts
        inner join hospitals on acts.hospital_id = hospitals.id
        where acts.deleted_at is null
        and acts.profile <> 'Personne décédée' and acts.profile <> 'Autre activité/Assises' and acts.profile <> 'Autre activité/Reconstitution'
        group by day, name, hospitals.id
        order by day, name;
`

exports.down = `drop view "living_acts_by_day";`
