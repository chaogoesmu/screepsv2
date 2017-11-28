var actDeposit = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //if I'm carrying something that is not energy
        if(_.sum(creep.carry) != creep.carry.energy)
        {
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) ;
                    }
                });
                //TODO: figure out what the command for deposit all is
                if(target != undefined) {
                    creep.moveTo(target);
                   for(const resourceType in creep.carry) {
                        creep.transfer(target, resourceType);
                    }  
                }
        }
        else
        {
            //I'm only carrrying energy, lets find a place to deposit it
            //find the closest extension or tower
        	var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        		filter: (structure) => {
        			return (structure.structureType == STRUCTURE_EXTENSION ||
        				structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        			}
        		});
        	//found an extension or tower, depositing
        	if(target!=undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        	else
    		{
    		    //if I couldn't find a tower or extension, lets find a spawn instead TODO: not working, find out why later.
    			var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    				filter: (structure) => {
    					(structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
    					}
    				});
    			if(target==undefined)
    			{
    			    //
    			   // console.log(creep.name + ' in room ' + creep.memory.myRoom + 'cannot find a spawn that needs energy');
    			}
    			if(target!=undefined) {
    				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    				}
    			}
    			else
    			{
    			    //ok, I couldn't find anything else, lets dump this in the nearest container or storage
    				var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    					filter: (structure) => {
    						return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store.energy < structure.storeCapacity );
    						}
    				});
    				if(target != undefined) {
        				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        				}
    				}
    				//oooook couldn't find anywhere to dump resources, either the room is full or there's just no path.
    				else{
    					
    					console.log(creep.memory.role + ' ' + creep.name + ' couldn\'t find a dropoff in room ' + creep.room.name);
    				}
    			}
        	}
        }
	}
};


module.exports = actDeposit;