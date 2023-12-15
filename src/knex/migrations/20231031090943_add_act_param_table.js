const data = [
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Coups blessures',
    act_duration: 50,
    ponderation: {
      age: { '0-2 ans': 0.9, '3-17 ans': 0.9, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 0.6, "Service d'hosp. privé": 0.6, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Sexuelle',
    act_duration: 49,
    ponderation: {
      age: { '0-2 ans': 0.85, '3-17 ans': 0.85, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 0.6, "Service d'hosp. privé": 0.6, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Maltraitance',
    act_duration: 50,
    ponderation: {
      age: { '0-2 ans': 0.9, '3-17 ans': 0.9, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 0.6, "Service d'hosp. privé": 0.6, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Violence psychologique',
    act_duration: 48,
    ponderation: {
      age: { '0-2 ans': 0.65, '3-17 ans': 0.65, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 0.6, "Service d'hosp. privé": 0.6, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Soumission chimique',
    act_duration: 40,
    ponderation: {
      age: { '0-2 ans': 1, '3-17 ans': 1, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 1, "Service d'hosp. privé": 1, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Accident',
    act_duration: 40,
    ponderation: {
      age: { '0-2 ans': 1, '3-17 ans': 1, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 1, "Service d'hosp. privé": 1, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Victime (vivante)',
    act_type: 'Somatique',
    violence_type: 'Attentat',
    act_duration: 40,
    ponderation: {
      age: { '0-2 ans': 1, '3-17 ans': 1, '+ de 18 ans': 1 },
      location: { "Service d'hosp. public": 1, "Service d'hosp. privé": 1, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Personne décédée',
    act_type: 'Examen externe',
    violence_type: '',
    act_duration: 106,
    ponderation: {
      age: { '0-2 ans': 1, '3-6 ans': 1, '7-17 ans': 1, 'Non déterminé': 1, '+ de 18 ans': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Personne décédée',
    act_type: 'Levée de corps',
    violence_type: '',
    act_duration: 128,
    ponderation: {
      age: { '0-2 ans': 1, '3-6 ans': 1, '7-17 ans': 1, 'Non déterminé': 1, '+ de 18 ans': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Personne décédée',
    act_type: 'Autopsie',
    violence_type: '',
    act_duration: 213,
    ponderation: {
      age: { '0-2 ans': 1.5, '3-6 ans': 1.5, '7-17 ans': 1.5, 'Non déterminé': 1.5, '+ de 18 ans': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Personne décédée',
    act_type: 'Anthropologie',
    violence_type: '',
    act_duration: 123,
    ponderation: {
      age: { '0-2 ans': 1, '3-6 ans': 1, '7-17 ans': 1, 'Non déterminé': 1, '+ de 18 ans': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Personne décédée',
    act_type: 'Odontologie',
    violence_type: '',
    act_duration: 123,
    ponderation: {
      age: { '0-2 ans': 1, '3-6 ans': 1, '7-17 ans': 1, 'Non déterminé': 1, '+ de 18 ans': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Personnes pour âge osseux (hors GAV)',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 48,
    ponderation: {
      age: {},
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Examen pour OFPRA',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 28,
    ponderation: {
      age: { 'Mineur': 1.7, 'Non déterminé': 1.7, 'Majeur': 1 },
      location: {},
      duration: {}
    }
  },
  {
    examined: 'Gardé.e à vue',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 29,
    ponderation: {
      age: { 'Mineur': 1, 'Non déterminé': 1, 'Majeur': 1 },
      location: { 'Commissariat': 1.5, 'Gendarmerie': 1.5, 'Tribunal': 1.5, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Autre activité - IPM',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 24,
    ponderation: {
      age: { 'Mineur': 1, 'Non déterminé': 1, 'Majeur': 1 },
      location: { 'Commissarait': 1, 'Gendarmerie': 1, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Autre activité -Personne retenue',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 29,
    ponderation: {
      age: { 'Mineur': 1, 'Non déterminé': 1, 'Majeur': 1 },
      location: { 'Commissariat': 1.5, 'Gendarmerie': 1.5, 'Tribunal': 1.5, 'Locaux douaniers': 1.5, 'Centre de rétention': 1.5, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Autre activité - Examen lié à la route',
    act_type: 'Somatique',
    violence_type: '',
    act_duration: 31,
    ponderation: {
      age: { 'Mineur': 1, 'Non déterminé': 1, 'Majeur': 1 },
      location: { 'Commissariat': 1, 'Gendarmerie': 1, 'Lieu de contrôle': 1, 'Autres lieux': 1 },
      duration: {}
    }
  },
  {
    examined: 'Autre activité - Assises',
    act_type: '',
    violence_type: '',
    act_duration: 62,
    ponderation: {
      age: {},
      location: {},
      duration: { '- de 4 heures': 1, '4 à 8 heures': 5.8, '+ de 8 heures': 7.8 }
    }
  },
  {
    examined: 'Autre activité - Reconstitution',
    act_type: '',
    violence_type: '',
    act_duration: 218,
    ponderation: {
      age: {},
      location: {},
      duration: { '- de 4 heures': 1, '4 à 8 heures': 1.6, '+ de 8 heures': 2.2 }
    }
  },
  {
    examined: 'Autre activité - Etude de dossier',
    act_type: '',
    violence_type: '',
    act_duration: 60,
    ponderation: {
      age: {},
      location: {},
      duration: { '- de 2 heures': 1, '2 à 4 heures': 4, '4 à 8 heures': 4, '+ de 8 heures': 8 }
    }
  },
]

exports.up = function (knex) {
  return knex.schema.createTable("act_summary_parameters", function (table) {
    table.increments("id")
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp("updated_at", { useTz: true })
    table.string("category", 255)
    table.string("examined", 255).notNullable()
    table.string("act_type", 255)
    table.string("violence_type", 255)
    table.integer("act_duration", 255).notNullable()
    table.jsonb("ponderation")
  })
    .then(function () {
      // Inserting data after table creation
      const transformedData = data.map((item) => ({
        ...item,
        category: `${item.examined} - ${item.act_type} - ${item.violence_type}`,
      }));
      return knex("act_summary_parameters").insert(transformedData);
    })
    .then(async () => {
      await knex.raw("create index acts_ponderation_idx on act_summary_parameters using gin (ponderation JSONB_PATH_OPS);")
    });
}

exports.down = async function (knex) {
  await knex.raw("drop index acts_ponderation_idx;")
  return knex.schema.dropTable("act_summary_parameters")
}