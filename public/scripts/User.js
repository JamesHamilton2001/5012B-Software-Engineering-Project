

class User
{
//ATTRIBUTES

    #id;                    //  number
    #firstName;             //  string
    #surname;               //  string
    #age;                   //  number 
    #weight;                //  number
    #height;                //  number
    #fullName;              //  string
    #bmi;                   //  number
    #currentGoals;          //  Goal[]
    #pastGoals;             //  Goal[]
    #activityLog;           //  Activity[]
    #mealLog;               //  Meal[]
    #groups;                //  Group


//CONSTRUCTOR

    constructor(id, firstName, surname, age, weight, height, currentPersonalGoals, pastPersonalGoals, activityLog, mealLog, groups)
    {
        this.#id        = id;
        this.#firstName = firstName;
        this.#surname   = surname;
        this.#age       = age;
        this.#weight    = weight;
        this.#height    = height;
        this.#fullName  = firstName.concat(" ", surname);
        this.#bmi       = weight / (height*height);

        //  if goals, groups and activities are not defined in constructor call, return from here. for when said data does not exist yet
        if (    currentPersonalGoals===undefined && pastPersonalGoals===undefined &&
                activityLog===undefined && mealLog===undefined && groups===undefined    )
            return;
        
        this.#currentGoals  = currentPersonalGoals;
        this.#pastGoals     = pastPersonalGoals;
        this.#activityLog   = activityLog;
        this.#mealLog       = mealLog;
        this.#groups        = groups;
    }


//GETTERS

    getId()             { return this.#id; }
    getFirstName()      { return this.#firstName; }
    getSurname()        { return this.#surname; }
    getAge()            { return this.#age; }
    getWeight()         { return this.#weight; }
    getHeight()         { return this.#height; }
    getFullName()       { return this.#fullName; }
    getBmi()            { return this.#bmi; }
    getCurrentGoals()   { return this.#currentGoals; }
    getPastGoals()      { return this.#pastGoals; }
    getActivityLog()    { return this.#activityLog; }
    getMealLog()        { return this.#mealLog; }
    getGroups()         { return this.#groups; }

    getCurrentGoalById(goalId)
    {
        for (let i = 0; i < this.#currentGoals.length; i++)
            if (this.#currentGoals[i].getId() === goalId)
                return this.#currentGoals[i];
        console.log("unable to find goal id\"", goalId, "\"");
    }


//SETTERS

    setId(id) {
        this.#id = id;
    }
    setFirstName(firstName) {
        this.#firstName = firstName;
        this.#fullName  = firstName.concat(" ", this.#surname);
    }
    setSurname(surname) {
        this.#surname  = surname;
        this.#fullName = this.#firstName.concat(" ", this.#surname);
    }
    setAge(age) {
        this.#age = age;
    }
    setWeight(weight) {
        this.#weight = weight;
        this.#bmi    = weight / (this.#height * this.#height);
    }
    setHeight(height) {
        this.#height = height;
        this.#bmi    = this.#weight / (height * height);
    }
    setFullName(firstName, surname) {                   //  TODO :  variadic implementation
        this.#firstName = firstName;
        this.#surname   = surname;
        this.#fullName  = firstName.concat(" ", surname);
    }


//MEMBER FUNCTIONS

    /*METHOD    :   createNewGoal

        PARAMETERS  :   type         - string : type of goal
                        desiredValue - number : value to reach by deadline
                        deadline     - Date   : date to reach desired value by
                        name         - string : user specified goal name
                        description  - string : user specified goal description

        RETURNS     :   nothing (TBC)

        DESCRIPTION :   takes arguments to create a new user goal and add it to currentGoals
    */
    createNewGoal(goalId, type, desiredValue, deadline, name, description)
    {
        this.#currentGoals.push(
            new UserGoal(goalId, type, desiredValue, deadline, name, description)
        );
    }

    //  deletes a goal of a given id
    deleteGoal(goalId)
    {
        for (let i = 0; i < this.#currentGoals.length; i++) {
            if (this.#currentGoals[i].getId() === goalId) {
                this.#currentGoals.splice(i, 1);
                return;
            }
        }
        console.log("unable to find user goal id \"", goalId, " \"");
    }

    //  increments a given goal's current value by a given increment. returns true if the goal is now complete, otherwise false
    progressGoal(goalId, amount, dateTime)
    {
        this.getCurrentGoalById(goalId).addContribution(amount, dateTime);
    }

    //  marks a given goal as failed, removes from currentGoals and adds to pastGoals
    failGoal(goalId)
    {
        this.getCurrentGoalById(goalId).fail();
    }


    /*METHOD    :   logActivity

        PARAMETERS  :   time  - Date   : time and date of activitytype  - string : type of activity
                        value - number : value of which activity was partaken to
                        type  - string : type of activity

        RETURNS     :   nothing (TBC)

        DESCRIPTION :   create activity object from arguments, add to activity log
    */
    logActivity(time, value, type)
    {
        //  TODO :  needs Activity class first
    }


    /*METHOD    :   logMeal

        PARAMETERS  :   time  - Date   : time and date the meal was eaten
                        foods - Food[] : variadic parameter of foods in the meal

        RETURNS     :   nothing (TBC)

        DESCRIPTION :   takes a variable number of food objects, encapsulates them into a meal, logging said meal into mealLog
    */
    logMeal(time, ...foods)
    {
        //  TODO :  needs Food and Meal class first
    }


    /*METHOD    :   createGroup

        PARAMETERS  :   name        - string      : user defined group name
                        description - string      : user defined group description
                        ...invitees - UserModel[] : users to be invited on init

        RETURNS     :   nothing (TBC)

        DESCRIPTION :   creates a new group, adds invitees if given
    */
    createGroup(name, description, invitees)
    {
        //  TODO :  needs Group class first
    }


    //  disbands a given group, applies to all members
    disbandGroup(group)
    {
        //  TODO :  needs Group class first
    }


    //  adds user to specified group. stores said group in groups
    joinGroup(group)
    {
        //  TODO :  needs Group class first
    }

    
    //  removes user from given group. removes group from groups
    leaveGroup(group)
    {
        //  TODO :  needs Group class first
    }


    /*METHOD    :   inviteToGroup

        PARAMETERS  :   group       - Group  : group to invite user(s) to
                        ...invitees - User[] : users to be invited

        RETURNS     :   nothing (TBC)

        DESCRIPTION :   invites a variadic amount of users to a specified group
    */
    inviteUsersToGroup(group, ...invitees)
    {
        //  TODO :  needs Group class first
    }
}

