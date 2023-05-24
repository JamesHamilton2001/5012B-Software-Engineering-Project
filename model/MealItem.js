import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default class MealItem {
   constructor(data) {
      // Copy/clone the properties from the given object to the new MealItem object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load/init other shit?
   }


   // Add a new item record to the given meal
   static async add(meal_id, type, quantity) {
      const sql = 'INSERT INTO user_meal_item(user_meal_id, food_type_id, quantity) VALUES(:user_meal_id, :food_type_id, :quantity)';
      const data = await db.run(sql, {
         ':user_meal_id': meal_id,
         ':food_type_id': food_type_id,
         ':quantity': quantity,
      });
      return data;
   }


   // Main factory method. Pulls all meal item records associated with a given meal 
   // from the database, and returns them as an array of MealItem objects.
   static async getByMealID(meal_id) {
      // TODO: consider a view merging both user_meal_item and user_meal_custom_item
      const sql = 'SELECT * FROM user_meal_item WHERE user_meal_id = :user_meal_id';
      const rows = await db.all(sql, {
         ':user_meal_id': meal_id,
      });
      // TODO: reconsider this check
      if(rows === undefined)
         return null;
      return rows.map(x => new MealItem(x));
   }


   // Return list of all meal_item/food types in the database.
   static async getTypes() {
      const sql = 'SELECT * FROM food_type';
      return db.all(sql);
   }


   // Add new food type to the database.
   static async addType(name, calories_per_100g) {
      const sql = 'INSERT INTO food_type(name, calories_per_100g) VALUES(:name, :calories_per_100g)';
      return db.run(sql, {
         ':name': name,
         ':calories_per_100g': calories_per_100g,
      });
   }
}


