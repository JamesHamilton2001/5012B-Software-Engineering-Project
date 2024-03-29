PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user (
   id INTEGER PRIMARY KEY,
   username
      TEXT
      UNIQUE
      COLLATE NOCASE
      NOT NULL,
   password
      TEXT
      NOT NULL,
   real_name
      TEXT
      NOT NULL,
   email
      TEXT
      UNIQUE
      COLLATE NOCASE
      NOT NULL,
   height
      INTEGER
      NOT NULL -- TODO: maybe drop NOT NULL, if the user skips initial entry?
      CHECK(height > 50) -- sanity check ensuring somebody isn't less than 50cm tall (could increase?)
   -- TODO: spec mentions potential 'additional information'
   -- possible extra fields: registration time, ideal weight?
);


CREATE TABLE IF NOT EXISTS user_weight (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   weight
      REAL
      NOT NULL
      CHECK(weight > 20.0), -- sanity check; 20kg is like a 6 year old or something
   timestamp
      INTEGER
      NOT NULL
      CHECK(timestamp > 0), -- could sanity check this as much later than 1970
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS exercise_type (
   id INTEGER PRIMARY KEY,
   name
      TEXT
      UNIQUE
      COLLATE NOCASE
      NOT NULL,
   metric
      TEXT
      NOT NULL
   -- TODO: add check constraint
);


CREATE TABLE IF NOT EXISTS user_exercise_session (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   exercise_type_id
      INTEGER
      NOT NULL,
   timestamp
      INTEGER
      NOT NULL
      CHECK(timestamp > 0), -- could sanity check this as much later than 1970
   value
      NUMBER
      NOT NULL,
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (exercise_type_id) REFERENCES exercise_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS meal_type (
   id INTEGER PRIMARY KEY,
   name
      TEXT
      UNIQUE
      COLLATE NOCASE
      NOT NULL
);

CREATE TABLE IF NOT EXISTS user_meal (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   meal_type_id
      INTEGER
      NOT NULL,
   timestamp
      INTEGER
      NOT NULL
      CHECK(timestamp > 0), -- could sanity check this as much later than 1970
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (meal_type_id) REFERENCES meal_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS food_type (
   id INTEGER PRIMARY KEY,
   name
      TEXT
      UNIQUE
      COLLATE NOCASE
      NOT NULL,
   calories_per_100g
      REAL
      NOT NULL
      CHECK(calories_per_100g > 0.0)
);

CREATE TABLE IF NOT EXISTS user_meal_item (
   id INTEGER PRIMARY KEY,
   user_meal_id
      INTEGER
      NOT NULL,
   food_type_id
      INTEGER
      NOT NULL,
   quantity
      REAL
      NOT NULL
      CHECK(quantity > 0.0),
   FOREIGN KEY (user_meal_id) REFERENCES user_meal(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (food_type_id) REFERENCES food_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user_meal_custom_item (
   id INTEGER PRIMARY KEY,
   user_meal_id
      INTEGER
      NOT NULL,
   name
      TEXT
      NOT NULL,
      -- TODO: check constraint for not blank?
   calories
      INTEGER
      NOT NULL,
      -- TODO: check > 0?
   FOREIGN KEY (user_meal_id) REFERENCES user_meal(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS groups (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   name
      TEXT
      NOT NULL,
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS groups_owner_name_index ON groups (user_id, name COLLATE NOCASE);

CREATE TABLE IF NOT EXISTS groups_member (
   id INTEGER PRIMARY KEY,
   groups_id
      INTEGER
      NOT NULL,
   user_id
      INTEGER
      NOT NULL,
   FOREIGN KEY (groups_id) REFERENCES groups(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS groups_member_index ON groups_member (groups_id, user_id);

CREATE TABLE IF NOT EXISTS groups_invite (
   id INTEGER PRIMARY KEY,
   groups_id
      INTEGER
      NOT NULL,
   user_id
      INTEGER
      NOT NULL,
   code
      TEXT
      NOT NULL,
   FOREIGN KEY (groups_id) REFERENCES groups(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS groups_invite_index ON groups_invite (groups_id, user_id);


CREATE TABLE IF NOT EXISTS goal (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   exercise_type_id
      INTEGER,
   target
      NUMBER
      NOT NULL
      CHECK(target > 0.0),
   start_time
      INTEGER
      NOT NULL
      CHECK(start_time > 0),
   end_time
      INTEGER
      NOT NULL
      CHECK(end_time > 0),
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (exercise_type_id) REFERENCES exercise_type(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS groups_goal (
   id INTEGER PRIMARY KEY,
   groups_id
      INTEGER
      NOT NULL,
   exercise_type_id
      INTEGER
      NOT NULL,
   target
      NUMBER
      NOT NULL
      CHECK(target > 0.0),
   start_time
      INTEGER
      NOT NULL
      CHECK(start_time > 0),
   end_time
      INTEGER
      NOT NULL
      CHECK(end_time > 0),
   FOREIGN KEY (groups_id) REFERENCES groups(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (exercise_type_id) REFERENCES exercise_type(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS groups_goal_member (
   id INTEGER NOT NULL,
   groups_goal_id
      INTEGER
      NOT NULL,
   user_id
      INTEGER
      NOT NULL,
   FOREIGN KEY (groups_goal_id) REFERENCES groups_goal(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS groups_goal_member_index ON groups_goal_member (groups_goal_id, user_id);

