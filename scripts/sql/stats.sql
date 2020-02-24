-- tous les actes, national
select count(*)
from acts
where deleted_at is null;

-- tous les actes par établissements de santé
select count(1), hospital_id, hospitals.name
from acts inner join hospitals on acts.hospital_id = hospitals.id
group by hospital_id, hospitals.name
order by 1 desc;

-- tous les actes, pour 1 ou plusieurs hôpitaux
select count(*)
from acts
where deleted_at is null
and hospital_id = ANY(:hids) -- ex: '{5, 6, 7}'
and created_at > TO_DATE(:start, 'DD/MM/YYYY')
and created_at <= current_date;

-- nb d'actes par structure et par jour
select date_trunc('day', acts.created_at)::date, name, count(*)
from acts
inner join hospitals h on acts.hospital_id = h.id
where acts.deleted_at is null
group by 1, 2
order by 1, 2;

-- moyenne des actes par structure et par jour
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

-- drop view average_acts;

/*
create view average_acts as
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
*/

-- moyenne des actes pour un ensemble d'établissements
select sum(average)
from average_acts
where hospital_id = any(:arr);

-- répartition Vivant/Thanato/Autres
select case
    when profile = 'Personne décédée' then 'Thanato'
    when profile = 'Autre activité/Assises' then 'Autres'
    when profile = 'Autre activité/Reconstitution' then 'Autres'
    else 'Vivant'
    end as type,
    count(*)
from acts
group by type
order by 2 desc;

-- nombre d'actes hors examens
select profile, count(*)
from acts
where (profile = 'Autre activité/Assises'
or profile = 'Autre activité/Reconstitution')
and hospital_id = any(:arr)
group by profile;

-- nombre d'actes qui ont le même pv
with acts_with_same_pv as (
    select count(*) as count
    from acts
    group by pv_number
    having count(*) > 1
) select sum(count)
from acts_with_same_pv;

-- moyenne d'actes avec le même pv
with acts_with_same_pv as (
    select count(*) as count
    from acts
    group by pv_number
) select trunc(avg(count), 2)
from acts_with_same_pv;


-------- page 2

-- nombre d'actes avec pv, sans pv et recueil de preuves sans plainte
select case
    when pv_number is not null and pv_number <> '' then 'Avec réquisition'
    when asker_id is null then 'Recueil de preuve sans plainte'
    else 'Sans réquisition'
    end as type, count(*)
from acts
group by type;

-- nombre d'actes avec type d'examen Somatique, Psychiatrique ou les 2
select count(*), extra_data->'examinationTypes'
from acts
where extra_data->'examinationTypes' @> '["Psychiatrique"]'
or  extra_data->'examinationTypes' @> '["Somatique"]'
group by extra_data->'examinationTypes';

-- ajout d'un index sur extra_data pour améliorer la performance des requêtes. À voir si c'est utile (pas utilisé dans mon cas)
CREATE INDEX idx_gin_examination_types ON acts USING GIN (extra_data);
DROP INDEX idx_gin_examination_types;

-- Répartition des horaires
select count(1) filter (where extra_data->'periodOfDay' <@ '["Matin", "Après-midi", "Journée"]') as Journée,
       count(1) filter (where extra_data->>'periodOfDay' = 'Soirée') as Soirée,
       count(1) filter (where extra_data->>'periodOfDay' = 'Nuit profonde') as "Nuit profonde"
from acts;


-- Répartition des examens
select
       count(1) filter (where extra_data->'examinations' @> '["Biologie"]') as Biologie,
       count(1) filter (where extra_data->'examinations' @> '["Imagerie"]') as Imagerie,
       count(1) filter (where extra_data->'examinations' @> '["Toxicologie"]') as Toxicologie,
       count(1) filter (where extra_data->'examinations' @> '["Anapath"]') as Anapath,
       count(1) filter (where extra_data->'examinations' @> '["Génétique"]') as Génétique,
       count(1) filter (where extra_data->'examinations' @> '["Autres"]') as Autres
from acts;