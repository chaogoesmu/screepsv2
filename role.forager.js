var actTravel = require('action.travel');
var actDeposit = require('action.deposit');
var actResupply = require('action.resupply');

var roleForager = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
        if(creep.memory.MyHome == creep.room.name)
        {
            if(creep.carry.energy ==0)
            {
                //go to your target room
                actTravel.run(creep, creep.memory.MyTravel);
            }
            else
            {
                //deposit energy
                actDeposit.run(creep);
            }
        }
        else
        {
            if(creep.carry.energy ==creep.carryCapacity)
            {
                //fine be difficult
                if (creep.memory.MyTravel>4)
                {
                    direction = creep.memory.MyTravel - 4;
                }
                else
                {
                    direction = creep.memory.MyTravel + 4;
                }
                actTravel.run(creep, direction);
            }
            else
            {
                //forage
                actResupply.run(creep);
            }
        }

    }
};

module.exports = roleForager;