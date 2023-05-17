PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user (
   id INTEGER PRIMARY KEY,
   username
      TEXT
      UNIQUE
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


CREATE TABLE IF NOT EXISTS excercise_type (
   id INTEGER PRIMARY KEY,
   name
      TEXT
      UNIQUE
      NOT NULL,
   metric
      TEXT
      NOT NULL
   -- TODO: add check constraint
);


CREATE TABLE IF NOT EXISTS user_excercise_session (
   id INTEGER PRIMARY KEY,
   user_id
      INTEGER
      NOT NULL,
   excercise_type_id
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
   FOREIGN KEY (excercise_type_id) REFERENCES excercise_type(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS meal_type (
   id INTEGER PRIMARY KEY,
   name
      TEXT
      UNIQUE
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

