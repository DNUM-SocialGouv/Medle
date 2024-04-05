exports.up = function(knex) {
    return knex.raw(`
    UPDATE act_summary_parameters
    SET 
      examined = CASE
          WHEN examined = 'Autre activité - IPM' THEN 'Autre activité/IPM'
          WHEN examined = 'Autre activité -Personne retenue' THEN 'Autre activité/Personne retenue'
          WHEN examined = 'Autre activité - Examen lié à la route' THEN 'Autre activité/Examen lié à la route'
          WHEN examined = 'Autre activité - Assises' THEN 'Autre activité/Assises'
          WHEN examined = 'Autre activité - Reconstitution' THEN 'Autre activité/Reconstitution'
          WHEN examined = 'Autre activité - Etude de dossier' THEN 'Autre activité/Étude de dossier'
          ELSE examined
      END,
      category = CONCAT_WS(' - ', 
                           CASE
                               WHEN examined = 'Autre activité - IPM' THEN 'Autre activité/IPM'
                               WHEN examined = 'Autre activité -Personne retenue' THEN 'Autre activité/Personne retenue'
                               WHEN examined = 'Autre activité - Examen lié à la route' THEN 'Autre activité/Examen lié à la route'
                               WHEN examined = 'Autre activité - Assises' THEN 'Autre activité/Assises'
                               WHEN examined = 'Autre activité - Reconstitution' THEN 'Autre activité/Reconstitution'
                               WHEN examined = 'Autre activité - Etude de dossier' THEN 'Autre activité/Étude de dossier'
                               ELSE examined
                           END,
                           act_type,
                           violence_type);
    `);
  };
  
  exports.down = function(knex) {
    return knex('act_summary_parameters')
      .update('examined', knex.raw(`CASE
          WHEN examined = 'Autre activité/IPM' THEN 'Autre activité - IPM'
          WHEN examined = 'Autre activité/Personne retenue' THEN 'Autre activité - Personne retenue'
          WHEN examined = 'Autre activité/Examen lié à la route' THEN 'Autre activité - Examen lié à la route'
          WHEN examined = 'Autre activité/Assises' THEN 'Autre activité - Assises'
          WHEN examined = 'Autre activité/Reconstitution' THEN 'Autre activité - Reconstitution'
          WHEN examined = 'Autre activité/Étude de dossier' THEN 'Autre activité - Etude de dossier'
          ELSE examined
        END`));
  };