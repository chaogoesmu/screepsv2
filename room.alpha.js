var roleGeneric = require('role.generic');
var roleUpgrader = require('role.upgrader');
var roleFixer = require('role.fixer');
var roleUpgrader = require('role.upgrader');
var roleMule = require('role.mule');
var roleTick = require('role.tick');

var runRoom = {

    run: function(RoomName) {
        //Spawn caps
        //TODO: make this dynamic
        //set by room level?  set by energy available?  how do I want to do this?
        //also, do I want to make this entirely dynamic?  lattice my extensions automatically?
        //what about defenses and storages?
        var MaxMule = 2;
        var MaxTick = 2;
        var MaxGeneralist = 3;
        var MaxUpgrader =1;

        //room control methods
		var genericCount =0;
		var idlecreeps = [];
		var busyCreeps = [];
		var MyCreeps = [0,0,0,0]

        //TODO: search the room and find my towers.
        runTower('59e01abdf8a4427bcdaccadd');
        runTower('59e46bcf6075d0438a53234d');


        //set values
        myRoom = Game.rooms[RoomName];
        //TODO: make the towers dynamic
        //myTowers = myRoom.find(STRUCTURE_TOWER);
        if(myRoom.memory.timer == undefined)
        {
            myRoom.memory.timer =0;
        }
        else
        {
            myRoom.memory.timer++;
        }
        if(myRoom.memory.timer > 1000)
        {
          myRoom.memory.timer =0;
        }
        //console.log(myRoom.find(FIND_MY_SPAWNS));
        if(myRoom.memory.mySpawn == undefined)
        {

            //TODO: works for single spawner, upgrade this to multiple later.
            mySpawn = myRoom.find(FIND_MY_SPAWNS);

            if(Array.isArray(mySpawn))
            {
                console.log(mySpawn.length);
                myRoom.memory.mySpawn = mySpawn[0].id;
                mySpawn = mySpawn[0];
            }
            else
            {
                myRoom.memory.mySpawn = mySpawn.id;
            }
        }
        else
        {
            mySpawn = Game.getObjectById(myRoom.memory.mySpawn);
        }

		var ThisRoomsCreeps = Game.creeps;
		ThisRoomsCreeps = _(ThisRoomsCreeps).filter({memory: {myRoom: RoomName}}).value();

		//not sure why I have to use this method
		for(var name in ThisRoomsCreeps)
		{
		    var creep = ThisRoomsCreeps[name];
    		switch(creep.memory.role){
                case 'upgrader':
                    roleUpgrader.run(creep);
        			MyCreeps[2]+=1;
        			break;
                case 'mule':
                    roleMule.run(creep);
        			MyCreeps[1]+=1;
                    break;
                case 'tick':
                    roleTick.run(creep);
        			MyCreeps[0]+=1;
                    break;
                case "claimer":
                    roleClaimer.run(creep);
                    break;

        		case "generalist":
    			    genericCount ++;
    			    roleGeneric.run(creep);

    			    if(creep.memory.action == 'idle')
    			    {
    			        idlecreeps.push(creep);
    			    }
    			    else
    			    {
    			        busyCreeps.push(creep);
    			    }
    			    MyCreeps[3]+=1;
        		    break;
        		default:
        		    break;
			//run the code and tally the things
    		}
		}
		//console.log('genericCount :' + genericCount +' upgrader:' +upgradey);
		//generics should handle fixing and building
		//ok, I have a list of all idle creeps... now I need to get a list of tasks
		if(idlecreeps.length !=0)
		{
		    var jobs = getJobs(myRoom);
		    var i=0;
		    for(;i<idlecreeps.length;i++)
		    {
    		    //if I have idle creeps lets look for tasks, otherwise waste of cpu.
    		    //console.log('idle creeps: ' + idlecreeps.length);
    		    if(i<jobs.length)
    		    {
    		        idlecreeps[i].say(jobs[i][0]);
    		        idlecreeps[i].memory.action =jobs[i][0];
    		        idlecreeps[i].memory.target =jobs[i][1];
    		    }
    		    else
    		    {
    		        //TODO: make the need change depending on room needs
    		        idlecreeps[i].memory.action ='upgrade';
    		        idlecreeps[i].memory.target = myRoom.controller.id;
    		    }

		    }
		}

		//respawn code here
		if(!mySpawn.spawning)
		{
    		if(MyCreeps[3] <MaxGeneralist)
    		{
    		    spawnGeneral(mySpawn.name,'generalist',RoomName,4);
    		}
    		if(MyCreeps[0]<MaxTick)// && mySpawn.room.energyAvailable > 700
    		{
    			//spawn tick
    			var name = mySpawn.createCreep( [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined,{role:'tick',myRoom:RoomName} );
    			console.log('Spawning: Tick '+ name + 'in room '+ RoomName );
    		}
    		if(MyCreeps[1]<MaxMule)
    		{
    			//spawn mule
    			var name = mySpawn.createCreep( [CARRY, CARRY,CARRY, CARRY,CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE
    			], undefined,{role:'mule',myRoom:RoomName} );
    			//var name = Game.spawns['Spawn.Prime'].createCreep( [CARRY, CARRY,MOVE,MOVE,CARRY, CARRY,MOVE,MOVE], undefined,{role:'mule'} );
    			console.log('Spawning: Mule '+ name + 'in room '+ RoomName );
    		}
    		if(MyCreeps[2]<MaxUpgrader)
    		{
    		    spawnGeneral(mySpawn.name, 'upgrader',RoomName,8);
    		}
		}

	}
}

function getJobs(MyRoom)
{
    var jobList = [];

    tempJobList =findRepairTarget(MyRoom);
    if(tempJobList!=0)
    {
        for(var i=0;i<tempJobList.length;i++)
        {
            jobList.push(["repair", tempJobList[i].id]);
        }
    }
    var tempJobList =findBuildTarget(MyRoom);
    if(tempJobList!=0)
    {
        for(var i=0;i<tempJobList.length;i++)
        {
            jobList.push(["build", tempJobList[i].id]);
        }
    }
    return jobList;
}
/*
//purpose of this fun
function filterJobs(jobList, busyCreeps)
{
    var refinedJobList = jobList.slice;
    for(var i =0;i<jobList.length;i++)
    {
        for(var i1=0;i1<busyCreeps.length;i1++)
        {
            if(joblist[i][] == busyCreeps)
        }
    }
}
*/
function prioritizeJobs(jobs, busyCreeps)
{
    var bCreeps = busyCreeps.slice();//make a copy of the possible creeps to iterate through
    var returnJobs = [];
    for(var i =0;i<jobs.length;i++)
    {
        for(var i1 = 0; i1<bCreeps.length;i1++)
        {

        }
    }
}

function findBuildTarget(myRoom)
{
	var targets = myRoom.find(FIND_CONSTRUCTION_SITES);//TODO: FIX THIS
    if(targets == undefined)
    {
		return 0;
    }
    if(Array.isArray(targets)){
        return targets;
    }
    else{
    return [targets];
    }
}

function findRepairTarget(myRoom)
{
    //TODO: fix this as well, need a way to select walls and ramparts.
    var targets = myRoom.find(FIND_STRUCTURES, {
        filter: (s) => 	(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)&& s.hits < s.hitsMax});
    if(targets == undefined)
    {
		return 0;
    }
    if(Array.isArray(targets)){
        return targets;
    }
    else{
    return [targets];
    }
}

//TODO: make this more dynamic
function spawnGeneral(spawnPoint, typeOfSpawn, roomName, max = 13)
{
    var top = Game.spawns[spawnPoint].room.energyCapacityAvailable;

    var loop = Math.floor(top/200);
    var i=0;
    var body = [];
	if(max<loop)
	{
		loop=max;
	}
	if(Game.spawns[spawnPoint].room.energyAvailable < loop*200)
	{
	    //console.log('Failed to spawn: '+typeOfSpawn + 'in '+roomName+ ' room has: ' +Game.spawns[spawnPoint].room.energyAvailable + ' / ' +Game.spawns[spawnPoint].room.energyCapacityAvailable + ' seeking: ' + loop*250);
	    return;
	}
    while(i<loop)
    {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        i++;
        //console.log('looped once: ' + i);
    }
	var name = Game.spawns[spawnPoint].createCreep( body, undefined,{role:typeOfSpawn,myRoom:roomName} );
	console.log('Spawning: '+typeOfSpawn+ ', ' + name + ' size: ' + loop);
}

function runTower(towerID)
{
	var tower = Game.getObjectById(towerID);
	var minRepair = 860000;
	if(tower) {
		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(closestHostile) {
			tower.attack(closestHostile);
		}
		else
		{

			var rampRepair = tower.room.find(FIND_STRUCTURES, {filter: s=> s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL});
			for (let ramps of rampRepair)
			{
				if(ramps.hits < minRepair)//this could be a problem during an assault where towers start repairing instead of attacking.
				{
					tower.repair(ramps);
				}
			}
			var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
			if (creepToRepair != undefined)
			{
				tower.heal(creepToRepair);
			}

		}
	}
}

/*
function findTarget(myRoom)
{
    var repairTarget = myRoom.find(FIND_STRUCTURES, {
        filter: (s) => 	(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)&& s.hits < s.hitsMax});

    if(repairTarget!= undefined)
    {
        //console.log(repairTarget);
        creep.memory.repairTarget = repairTarget.id;
    }
    else
    {
        var repairTarget = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
        		return ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && (s.hits < s.hitsMax));
        	}
        });
        if(repairTarget.length > 0){
            var i=0;
            creep.memory.repairTarget = repairTarget[0].id;
            var target = Game.getObjectById(creep.memory.repairTarget);
            while(i<repairTarget.length)
            {
                if(repairTarget[i] != undefined && target.hits>repairTarget[i].hits)
                {
                	creep.memory.repairTarget = repairTarget[i].id;
                	target = repairTarget[i];
                }
                i++;
            }
            console.log('Repairing Walls :' + creep.memory.repairTarget);
        }
        else
        {
            //console.log('no valid repair targets found, please check code');
        }
    }

}
*/
module.exports = runRoom;
/*
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		switch(creep.memory.role){
		*/
