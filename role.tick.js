var roleTick = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //TODO: count how long it takes to reach container, set that to countdown of death, and spawn a new one based on this tick at that time.
        //TODO: spawn, if theres not a container head to source then drop a container when you reach it, until its built just drop mine
        if(creep.fatigue!=0){
			return;
		}
        if(creep.memory.MyContainer == undefined)
        {
            creep.memory.MyTask = -1;
        }
		
		switch(creep.memory.MyTask){
			case 0://get more energy
				FindMoveContainer(creep);
			    break;
			case 1://go fill somethings energy
                creep.harvest(Game.getObjectById(creep.memory.MySource));
			    break;
			default://uhoh
    			console.log('initializing tick');
    			creep.memory.MyContainer = 0;
    			creep.memory.MySource = 0;
    			creep.memory.MyTask = 0;
    			break;
		}
	}
};
function FindMoveContainer(creep)
{
    if(creep.memory.MyContainer == 0)
    {
        var creepsInRoom = creep.room.find(FIND_MY_CREEPS);
        let sources = creep.room.find(FIND_SOURCES);
        // iterate over all sources
        for (let source of sources) {
        	// if the source has no miner
        	if (!_.some(creepsInRoom, c => c.memory.role == 'tick' && c.memory.MySource == source.id)) 
        	{
        		// check whether or not the source has a container
        		let containers = source.pos.findInRange(FIND_STRUCTURES, 1, 
        		{
        			filter: s => s.structureType == STRUCTURE_CONTAINER
        		});
        		
        		// if there is a container next to the source
        		if (containers!= undefined) {
        		    (!_.some(creepsInRoom, c => c.memory.role == 'tick' && c.memory.MyContainer == containers[0].id)) 
        			creep.memory.MyContainer = containers[0].id;
        			creep.memory.MySource = source.id;
        			break;
        		}
        		else
        		{
           			creep.memory.MyContainer = containers[1].id;
        			creep.memory.MySource = source.id;
        			break;
        		}
        	}
        }
    }
    if(creep.memory.MyContainer == 0)
    {
        console.log('no container found');
    }
    creep.moveTo(Game.getObjectById(creep.memory.MyContainer));
    if (creep.pos.isEqualTo(Game.getObjectById(creep.memory.MyContainer))) 
    {
        creep.memory.MyTask = 1;
    }
}

module.exports = roleTick;