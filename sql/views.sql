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
