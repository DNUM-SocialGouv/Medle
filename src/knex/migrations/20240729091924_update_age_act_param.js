
exports.up = function(knex) {
    const updates = [
        { id: 1, age: { "0-2 ans": 0.9, "3-5 ans": 0.9, "6-10 ans": 0.9, "11-14 ans": 0.9,"15-17 ans": 0.9, "+ de 18 ans": 1 } },
        { id: 2, age: { "0-2 ans": 0.85, "3-5 ans": 0.85, "6-10 ans": 0.85, "11-14 ans": 0.85,"15-17 ans": 0.85, "+ de 18 ans": 1 } },
        { id: 3, age: { "0-2 ans": 0.9, "3-5 ans": 0.9, "6-10 ans": 0.9, "11-14 ans": 0.9,"15-17 ans": 0.9, "+ de 18 ans": 1 } },
        { id: 4, age: { "0-2 ans": 0.65, "3-5 ans": 0.65, "6-10 ans": 0.65, "11-14 ans": 0.65,"15-17 ans": 0.65, "+ de 18 ans": 1 } },
        { id: 5, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1 } },
        { id: 6, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1 } },
        { id: 7, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1 } },
        { id: 8, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1, "Non déterminé": 1 } },
        { id: 9, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1, "Non déterminé": 1 } },
        { id: 10, age: { "0-2 ans": 1.5, "3-5 ans": 1.5, "6-10 ans": 1.5, "11-14 ans": 1.5,"15-17 ans": 1.5, "+ de 18 ans": 1, "Non déterminé": 1.5 } },
        { id: 11, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1, "Non déterminé": 1 } },
        { id: 12, age: { "0-2 ans": 1, "3-5 ans": 1, "6-10 ans": 1, "11-14 ans": 1,"15-17 ans": 1, "+ de 18 ans": 1, "Non déterminé": 1 } },
      ];
    
      const updatePromises = updates.map(({ id, age }) =>
        knex('act_summary_parameters')
          .where({ id })
          .update({
            ponderation: knex.raw(`
              jsonb_set(ponderation::jsonb, '{age}', ?::jsonb)
            `, JSON.stringify(age))
          })
      );
    
      return Promise.all(updatePromises);
};

exports.down = function(knex) {
  
};
