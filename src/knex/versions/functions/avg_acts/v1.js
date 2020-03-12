/**
 * Stored function written in pure SQL.
 * It has to be called like this:
 *
 * select * from avg_acts('2020-03-01', '2020-03-09')
 * where id in (1, 2) -- list of id of hospitals
 * and type = 'Vivant';
 *
 * Allow to easily get the average number of acts by hospital and by profile.
 *
 * Type filter is related to the profile field. It has the same meaning, except the specific "Vivant" value, which is a generic profile for all the living acts.
 *
 * Warning:
 */
exports.up = `
    create or replace function avg_acts  (
        in startDate    text,
        in endDate      text,
        out name        text,
        out id          int,
        out type        text,
        out avg         decimal(2)
    ) returns setof record
    language sql as
    $$
    with all_hospitals_by_day as (
        select calendar.entry::date as day, name, id, unnest(array['Vivant', 'Personne décédée', 'Autre activité/Assises', 'Autre activité/Reconstitution']) as type
        from hospitals, generate_series(avg_acts.startDate::date, avg_acts.endDate::date, '1 day'::interval) as calendar(entry)
    ) select all_hospitals_by_day.name,
            all_hospitals_by_day.id,
            all_hospitals_by_day.type,
            trunc(avg(coalesce(acts_by_day.nb_acts, 0)), 2) as avg
    from all_hospitals_by_day
        left join acts_by_day on
            all_hospitals_by_day.day = acts_by_day.day::date
            and all_hospitals_by_day.type = acts_by_day.type
            and all_hospitals_by_day.id = acts_by_day.hospital_id
    group by id, all_hospitals_by_day.name, all_hospitals_by_day.type
    order by id, avg desc;
    $$;`

exports.down = `drop function if exists "avg_acts"`
