exports.up = `
    create view "acts_by_day" as
        select date_trunc('day', acts.examination_date)::date as day, name,
        hospitals.id as hospital_id,
        acts.profile as type,
        count(*) as nb_acts
        from acts
           inner join hospitals on acts.hospital_id = hospitals.id
        where acts.deleted_at is null
        group by day, name, hospitals.id, type
        union
        select date_trunc('day', acts.examination_date)::date as day, name,
        hospitals.id as hospital_id,
        'Vivants (tous profils)' as type,
        count(*) as nb_acts
        from acts
           inner join hospitals on acts.hospital_id = hospitals.id
        where acts.deleted_at is null
        and acts.profile != 'Personne décédée'
        and acts.profile != 'Autre activité/Assises'
        and acts.profile != 'Autre activité/Reconstitution'
        group by day, name, hospitals.id, type
        order by day, name, hospital_id, nb_acts desc, type;
`

exports.down = `drop view "acts_by_day";`
