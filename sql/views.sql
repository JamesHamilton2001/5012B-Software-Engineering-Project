CREATE VIEW exercise_view AS
   SELECT
      user_exercise_session.id,
      user_id,
      exercise_type.id AS type_id,
      exercise_type.name,
      value,
      exercise_type.metric,
      timestamp
   FROM user_exercise_session
   INNER JOIN exercise_type
      ON exercise_type_id = exercise_type.id
;

CREATE VIEW meal_item_view AS
   SELECT
      user_meal_item.id,
      user_meal_id
         AS meal_id,
      food_type_id
         AS type_id,
      food_type.name
         AS type,
      quantity,
      calories_per_100g,
      calories_per_100g * quantity / 100
         AS calories
   FROM user_meal_item
   INNER JOIN food_type
      ON food_type_id = food_type.id
;
