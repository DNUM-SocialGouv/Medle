
exports.up = function (knex) {
    return knex.schema.createTable("act_pre_summary", function (table) {
      table.increments("id")
      table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now())
      table.timestamp("updated_at", { useTz: true })
      table.date("examination_date", 255).notNullable()
      table.string("examined", 255)
      table.string("act_type", 255)
      table.string("violence_type", 255)
      table.string("location", 255)
      table.string("age", 255) 
      table.string("duration", 255) 
      table.integer("act_duration", 255).notNullable()
      table.string("category", 255)
      table.float("ponderation")
      
      table.integer("added_by").unsigned()
      table.integer("hospital_id").unsigned()
     

      table.foreign("added_by").references("id").inTable("users")

      table.foreign("hospital_id").references("id").inTable("hospitals")
    })
    .then(async function() {
      // This function generates random examination types from the provided list
function getRandomExaminationType() {
  const examinationTypes = [
    "Somatique",
    "Autopsie",
    "Examen externe",
    // Add more examination types if needed
  ];
  return examinationTypes[Math.floor(Math.random() * examinationTypes.length)];
}

// Function to generate a random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate a random integer between min and max
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sample data to be used for random row generation
const sampleData = [
  {
    id: 8348,
    created_at: "2020-05-05 07:00:21.001444",
    updated_at: null,
    deleted_at: null,
    internal_number: "4006413",
    pv_number: "BC/2020/21PSY",
    asker_id: 3860,
    profile: "Victime (vivante)",
    examination_date: "2020-05-05",
    added_by: 9,
    extra_data:
      '{"location": "UMJ", "periodOfDay": "Journée", "personAgeTag": "+ de 18 ans", "personGender": "Féminin", "violenceNatures": ["Coups blessures"], "examinationTypes": ["Somatique"], "violenceContexts": ["Autre type/Autre"]}',
    hospital_id: 4,
  },
  {
    id: 8349,
    created_at: "2020-05-05 07:05:42.458373",
    updated_at: null,
    deleted_at: null,
    internal_number: "20/275",
    pv_number: "2020/19887",
    asker_id: 200,
    profile: "Personne décédée",
    examination_date: "2020-05-04",
    added_by: 2,
    extra_data:
      '{"periodOfDay": "Journée", "examinations": ["Imagerie", "Toxicologie", "Anapath"], "personAgeTag": "+ de 18 ans", "personGender": "Masculin", "examinationTypes": ["Autopsie"]}',
    hospital_id: 1,
  },
  {
    id: 8350,
    created_at: "2020-05-05 07:06:18.911979",
    updated_at: null,
    deleted_at: null,
    internal_number: "20/276",
    pv_number: "70677/1539/2020",
    asker_id: 3860,
    profile: "Personne décédée",
    examination_date: "2020-05-04",
    added_by: 2,
    extra_data:
      '{"periodOfDay": "Journée", "examinations": ["Imagerie", "Toxicologie"], "personAgeTag": "+ de 18 ans", "personGender": "Masculin", "examinationTypes": ["Autopsie"]}',
    hospital_id: 1,
  },
  {
    id: 8351,
    created_at: "2020-05-05 07:07:03.756349",
    updated_at: null,
    deleted_at: null,
    internal_number: "20/277",
    pv_number: "2020/20019",
    asker_id: 200,
    profile: "Personne décédée",
    examination_date: "2020-05-04",
    added_by: 2,
    extra_data:
      '{"periodOfDay": "Journée", "examinations": ["Imagerie"], "personAgeTag": "+ de 18 ans", "personGender": "Masculin", "examinationTypes": ["Examen externe"]}',
    hospital_id: 1,
  },
  {
    id: 8352,
    created_at: "2020-05-05 07:07:30.959806",
    updated_at: null,
    deleted_at: null,
    internal_number: "20/278",
    pv_number: "2020/20063",
    asker_id: 200,
    profile: "Personne décédée",
    examination_date: "2020-05-04",
    added_by: 2,
    extra_data:
      '{"periodOfDay": "Journée", "examinations": ["Imagerie"], "personAgeTag": "+ de 18 ans", "personGender": "Féminin", "examinationTypes": ["Examen externe"]}',
    hospital_id: 1,
  },
  {
    id: 8353,
    created_at: "2020-05-05 07:07:54.163922",
    updated_at: null,
    deleted_at: null,
    internal_number: "20/279",
    pv_number: "2020/8966",
    asker_id: 200,
    profile: "Personne décédée",
    examination_date: "2020-05-04",
    added_by: 4,
    extra_data:
      '{"periodOfDay": "Journée", "examinations": ["Imagerie"], "personAgeTag": "+ de 18 ans", "personGender": "Masculin", "examinationTypes": ["Examen externe"]}',
    hospital_id: 3,
  },
  {
    id: 8354,
    created_at: "2020-05-05 07:18:13.294872",
    updated_at: null,
    deleted_at: null,
    internal_number: "127414-vp",
    pv_number: "2020/6432",
    asker_id: 200,
    profile: "Victime (vivante)",
    examination_date: "2020-05-05",
    added_by: 4,
    extra_data:
      '{"location": "UMJ", "periodOfDay": "Journée", "personAgeTag": "3-17 ans", "personGender": "Féminin", "violenceNatures": ["Coups blessures"], "examinationTypes": ["Psychiatrique"], "violenceContexts": ["Autre type/Scolaire"]}',
    hospital_id: 3,
  },
  {
    id: 8355,
    created_at: "2020-05-05 07:19:09.154954",
    updated_at: null,
    deleted_at: null,
    internal_number: "127418-vc",
    pv_number: "2020/6633",
    asker_id: 200,
    profile: "Victime (vivante)",
    examination_date: "2020-05-05",
    added_by: 4,
    extra_data:
      '{"location": "UMJ", "periodOfDay": "Journée", "personAgeTag": "3-17 ans", "personGender": "Masculin", "violenceNatures": ["Coups blessures"], "examinationTypes": ["Somatique"], "violenceContexts": ["Infra-familiale (hors conjugale)"]}',
    hospital_id: 3,
  },
  {
    id: 8356,
    created_at: "2020-05-05 07:19:42.092872",
    updated_at: null,
    deleted_at: null,
    internal_number: "127417-vc",
    pv_number: "2020/6633",
    asker_id: 3860,
    profile: "Victime (vivante)",
    examination_date: "2020-05-05",
    added_by: 4,
    extra_data:
      '{"location": "UMJ", "periodOfDay": "Journée", "personAgeTag": "+ de 18 ans", "personGender": "Féminin", "violenceNatures": ["Coups blessures"], "examinationTypes": ["Somatique"], "violenceContexts": ["Conjugale"]}',
    hospital_id: 3,
  },
  {
    id: 8357,
    created_at: "2020-05-05 07:30:04.585235",
    updated_at: null,
    deleted_at: null,
    internal_number: "4006416",
    pv_number: "2020/00364",
    asker_id: 200,
    profile: "Victime (vivante)",
    examination_date: "2020-05-05",
    added_by: 4,
    extra_data:
      '{"location": "UMJ", "periodOfDay": "Journée", "personAgeTag": "3-17 ans", "personGender": "Féminin", "violenceNatures": ["Sexuelle"], "examinationTypes": ["Psychiatrique"], "violenceContexts": ["Autre type/Autre"]}',
    hospital_id: 3,
  },
  {
    id: 8358,
    created_at: "2020-05-05 07:31:36.163583",
    updated_at: null,
    deleted_at: null,
    internal_number: "A20058",
    pv_number: "2020/4422",
    asker_id: 200,
    profile: "Gardé.e à vue",
    examination_date: "2020-05-04",
    added_by: 4,
    extra_data:
      '{"location": "Commissariat", "periodOfDay": "Journée", "personAgeTag": "Majeur", "personGender": "Masculin", "examinationTypes": ["Somatique"]}',
    hospital_id: 3,
  },
  {
    id: 8359,
    created_at: "2020-05-05 07:32:53.647037",
    updated_at: null,
    deleted_at: null,
    internal_number: "A200510",
    pv_number: "2020/4335",
    asker_id: 200,
    profile: "Gardé.e à vue",
    examination_date: "2020-05-04",
    added_by: 4,
    extra_data:
      '{"location": "Commissariat", "periodOfDay": "Journée", "personAgeTag": "Majeur", "personGender": "Masculin", "examinationTypes": ["Somatique"]}',
    hospital_id: 3,
  },
  {
    id: 8360,
    created_at: "2020-05-05 07:32:53.647037",
    updated_at: null,
    deleted_at: "2020-05-05 07:32:53.647037",
    internal_number: "A200510",
    pv_number: "2020/4335",
    asker_id: 200,
    profile: "Gardé.e à vue",
    examination_date: "2020-05-04",
    added_by: 9,
    extra_data:
      '{"location": "Commissariat", "periodOfDay": "Journée", "personAgeTag": "Majeur", "personGender": "Masculin", "examinationTypes": ["Somatique"]}',
    hospital_id: 4,
  },
];

function generateRandomRow(data, usedIds) {
  const randomData = data[Math.floor(Math.random() * data.length)];

  let newId = randomData.id;
  while (usedIds.has(newId)) {
    newId = randomData.id + Math.floor(Math.random() * 10000); // Generating a new ID
  }
  usedIds.add(newId); // Adding the new ID to the set of used IDs

  // Modify the data to insert random values
  return {
    ...randomData,
    id: newId, // Ensure unique ID
    created_at: getRandomDate(new Date(2020, 0, 1), new Date()),
    examination_date: getRandomDate(new Date(2020, 0, 1), new Date()),
    // Modify other fields as needed to generate random data
  };
}

const usedIds = new Set();
const insertionPromises = [];

// Generate and insert 300,000 random rows
for (let i = 0; i < 10000; i++) {
  // Randomly select sample data
  const randomRow = generateRandomRow(sampleData, usedIds);

  // Insert this random row into your database table
  // You can use your database library or Knex here to insert the row
  // For example, if using Knex:
  insertionPromises.push(knex("acts").insert(randomRow)
  );
}
Promise.all(insertionPromises)
  .then(() => {
    console.log("Finished inserting 300,000 random rows");
  })
  .catch(error => {
    console.error("Error inserting rows:", error.message);
  });
    })
    .then(async function () {
      // Extracting and transforming data from 'acts' table using the index
      const actsData = await knex("acts")
        .select(
          "examination_date",
          "profile as examined",
          "added_by",
          "hospital_id",
          knex.raw("extra_data->>'examinationTypes' as act_type"),
          knex.raw("extra_data->>'personAgeTag' as age"),
          knex.raw("extra_data->>'violenceNatures' as violence_type"),
          knex.raw("extra_data->>'location' as location"),
          knex.raw("extra_data->>'duration' as duration"),
        )

        const actPreSummaryData = [];

        for (const act of actsData) {
          // Fetching specific fields from the extra_data JSONB column
          const examined = act.examined;
          const actType = act.act_type?.match(/"(.*?)"/)[1] || '';
          const violenceType = act.violence_type?.match(/"(.*?)"/)[1] || '';
          const age = act.age;
          const location = act.location;
      
          // Creating the category by concatenating fields
          const category = `${examined} - ${actType} - ${violenceType}`;
      
          // Find corresponding summary act parameter for each act
          const correspondingSummaryActParameter = await knex("summary_act_parameters")
            .where('category', category)
            .first();
            let ponderation = 1
console.log(correspondingSummaryActParameter, correspondingSummaryActParameter?.ponderation.age[age], act);
          if(correspondingSummaryActParameter) {
          if(Object.keys(correspondingSummaryActParameter.ponderation.age) !== 0) {
            ponderation = correspondingSummaryActParameter.ponderation.age[age]
          } else if(Object.keys(correspondingSummaryActParameter.ponderation.location) !== 0) {
            ponderation = correspondingSummaryActParameter.ponderation.location[location]
          } else if(Object.keys(correspondingSummaryActParameter.ponderation.duration) !== 0) {
            ponderation = correspondingSummaryActParameter.ponderation.duration[duration]
          }
        }
        console.log("ponderation", ponderation);
          // Prepare data for insertion into the act_pre_summary table
          const dataForSummary = {
            ...act,
            act_duration: correspondingSummaryActParameter?.act_duration * ponderation || 50,
            ponderation,
            category,
            act_type: actType,
            violence_type: violenceType
          };
      
          actPreSummaryData.push(dataForSummary);
        }
  
      // Insert the transformed and calculated data into the new table
      await knex.batchInsert("act_pre_summary", actPreSummaryData);
  
      console.log("Data inserted into act_pre_summary table");
    });
  }
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("act_pre_summary")
  }