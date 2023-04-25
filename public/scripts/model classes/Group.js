

class Group
{
//ATTRIBUTES

    #id;
    #members;
    #ownerName;
    #description;
    #ownerName;
    #currentGoals = [];
    #pastGoals = [];


    constructor(id, name, description, ownerName, members, pastGoals, currentGoals)
    {
        let optArgCount = 0;
        for (let i = 0; i < arguments.length-4; i++)
            if (arguments[i] !== undefined) 
                optArgCount++;

        this.#id           = id;
        this.#name         = name;
        this.#description  = description;
        this.#ownerName    = ownerName;

        if (optArgCount === 0) return;

        if (optArgCount === 3) {
            this.#members      = members;
            this.pastGoals     = pastGoals;
            this.currentGoals  = currentGoals;
            return;
        }

        throw new Error (
            "Group construction needs all arguments or just id, owner, name, description"
        );
    }


//GETTERS

    getId()             { return this.#id; }
    getOwner()          { return this.#ownerName; }
    getMembers()        { return this.#members; }
    getOwnerName()      { return this.#ownerName; }
    getDescription()    { return this.#description; }
    getCurrentGoals()   { return this.#currentGoals; }
    getPastGoals()      { return this.#pastGoals; }


//SETTERS

    setId(id)                       { this.#id = id; }
    setOwner(owner)                 { this.#ownerName = owner; }
    setMembers(members)             { this.#members = members; }
    setOwnerName(ownerName)         { this.#ownerName = ownerName; }
    setDescription(description)     { this.#description = description; }
    setCurrentGoals(currentGoals)   { this.#currentGoals = currentGoals; }
    setPastGoals(pastGoals)         { this.#pastGoals = pastGoals; }


//METHODS

    addGoal(goalId, desiredValue, deadline, name, description)
    {
        this.currentGoals.push(goalId, desiredValue, deadline, name, description);
    }

    removeGoal(goalId)
    {
        for (let i = 0; i < this.#currentGoals.length; i++) {
            if (this.#currentGoals[i].getId() === goalId) {
                this.#currentGoals.splice(i, 1);
                return;
            }
        }
        console.log("unable to find group goal id \"", goalId, " \"");
    }

    addGoalProgress(goalId, userId, amount)
    {
        for (let i = 0; i < this.#currentGoals.length; i++) {
            if (this.#currentGoals[i].getId() === goalId) {
                this.#currentGoals[i].addContribution(goalId, userId, amount);
                return;
            }
        }
        console.log("unable to find user id \"", id, " \"");
    }

    completeGoal(goalId)
    {
        for (let i = 0; i < this.#currentGoals.length; i++) {
            if (this.#currentGoals[i].getId() === goalId) {
                this.#currentGoals[i].complete();
                return;
            }
        }
        console.log("unable to find group goal id \"", id, "\"");
    }
}