



class GroupGoal
{
//ATTRIBUTES

    #id;                    //  number      :   unique id
    #type                   //  string      :   
    #desiredValue;          //  number      :   value to reach for completion
    #deadline;              //  Date        :   deadline for completion
    #isCurrent;             //  boolean     :   is it an active goal?
    #isAchieved;            //  boolean     :   has it already been achieved?
    #currentValue;          //  number      :   current value towards goal
    #progressRate;          //  number      :   -ive not on track, +ive on track
    #contributions          //  tuple array :   array of (id, name, amount, time) user goal contributions
    #name;                  //  string      :   name of goal
    #description            //  string      :   description of goal


/*CONSTRUCTOR

        PARAMETERS :    id
                        desiredValue
                        deadline
                        name
                        description
                        currentValue
                        contributions

        DESCRIPTION :   for creating a new goal, provide arguments for
                            id, desiredValue, deadline, name, description
                        for creating an already established goal, provide arguments for all
    */
    constructor(id, type, desiredValue, deadline, name, description, currentValue, contributions)
    {
        //  if only one of isAchieved and contribution is defined, throw an exception
        if (    (currentValue === undefined && contributions !== undefined)  ||
                (currentValue !== undefined && contributions === undefined) )
            throw new Error("GroupGoal's isAchieved and contribution arguments are XOR optional");

        this.#id           = id;
        this.#type         = type;
        this.#desiredValue = desiredValue;
        this.#deadline     = deadline;
        this.#name         = name;
        this.#description  = description;
        
        if (currentValue === undefined) {
            this.#isCurrent = true;
            return;
        }
        this.#currentValue  = currentValue;
        this.#contributions = contributions;
        
        //  TODO :  make this work in multiple time zones
        //  if deadline is after current date:
        if (new Date() < deadline)
        {
            if (currentValue > 0  &&  currentValue < desiredValue) {
                this.#isCurrent = true;
                return;
            }
            this.complete();
            return;
        }
        //  deadline has already passed...
        this.isCurrent = false;

        if (currentValue < desiredValue) {
            this.fail();
            return;
        }
        this.complete();
    }


//GETTERS
    
    getId()             { return this.#id; }
    getDesiredValue()   { return this.#desiredValue; }
    getDeadline()       { return this.#deadline; }
    getCurrentValue()   { return this.#currentValue; }
    getIsCurrent()      { return this.#isCurrent; }
    getIsAchieved()     { return this.#isAchieved; }
    getProgressRate()   { return this.#progressRate; }
    getContributions()  { return this.#contributions; }
    getName()           { return this.#name; }
    getDescription()    { return this.#description; }
    

//SETTERS

    setId(id)                       { this.#id = id; }
    setDesiredValue(desiredValue)   { this.#desiredValue = desiredValue; }
    setDeadline(deadline)           { this.#deadline = deadline; }
    setCurrentValue(currentValue)   { this.#currentValue = currentValue; }
    setIsCurrent(isCurrent)         { this.#isCurrent = isCurrent; }
    setIsAchieved(isAchieved)       { this.#isAchieved = isAchieved; }
    setName(name)                   { this.#name = name; }
    setDescription(description)     { this.#description = description; }


//METHODS

    complete()
    {
        this.#isAchieved   = true;
        this.#isCurrent    = false;
        this.#currentValue = this.#desiredValue;
    }

    fail()
    {
        this.#isCurrent  = false;
        this.#isAchieved = false;
    }

    addContribution(amount, dateTime, id, name)
    {
        if (dateTime > this.#deadline) {
            console.log("Cannot add contributions after the deadline");
            return;
        }

        this.#contributions.push( new tuple(amount, dateTime, id, name) );
        this.#currentValue += amount;

        if (this.#currentValue >= this.#desiredValue)
            this.complete();
    }

    toString()
    {
        return "UserGoal:".concat(
            this.#id ,",", this.#type ,",", this.#name ,",",
            this.#currentValue ,"/", this.#desiredValue
        );
    }
}