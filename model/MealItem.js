import db from '../db.js';

export default class MealItem {
   constructor(data) {
      // Copy/clone the properties from the given object to the new MealItem object.
      // This should be considered garbage in; garbage out, so the factory method(s)
      // should be used instead of the constructor directly.
      Object.assign(this, data);

      // TODO: load/init other shit?
   }


   // Attempt to add an item from an object representing either a pre-defined or
   // custom food item, as might be sent from the client.
   static add(meal_id, item) {
      if('id' in item && 'quantity' in item)
         return this.addPreset(meal_id, item.id, item.quantity);
      if('name' in item && 'calories' in item)
         return this.addCustom(meal_id, item.name, item.calories);
      return new Error('Invalid item format');
   }


   // Add a new preset item record to the given meal
   static async addPreset(meal_id, type, quantity) {
      const sql = 'INSERT INTO user_meal_item(user_meal_id, food_type_id, quantity) VALUES(:user_meal_id, :food_type_id, :quantity)';
      const data = await db.run(sql, {
         ':user_meal_id': meal_id,
         ':food_type_id': type,
         ':quantity': quantity,
      });
      return data;
   }


   // Add a new custom item record to the given meal
   static async addCustom(meal_id, name, calories) {
      const sql = 'INSERT INTO user_meal_custom_item(user_meal_id, name, calories) VALUES(:user_meal_id, :name, :calories)';
      const data = await db.run(sql, {
         ':user_meal_id': meal_id,
         ':name': name,
         ':calories': calories,
      });
      return data;
   }


   // Main factory method. Pulls all meal item records associated with a given meal 
   // from the database, and returns them as an array of MealItem objects.
   static async getByMealID(meal_id) {
      // TODO: consider a view merging both user_meal_item and user_meal_custom_item
      const sql = 'SELECT * FROM meal_item_view WHERE meal_id = :meal_id';
      const rows = await db.all(sql, {
         ':meal_id': meal_id,
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


