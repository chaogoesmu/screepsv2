var roleGeneric = require('role.generic');
var roleUpgrader = require('role.upgrader');
var roleFixer = require('role.fixer');
var roleUpgrader = require('role.upgrader');
var roleMule = require('role.mule');
var roleTick = require('role.tick');
var roleClaimer = require('role.claimer');

/*
how do we determine the spawn list for this room?
first off we need to formalize a setup for these things
ok, make an object for the room, store it in memory.
max values could then be recalled with this.['max' + creep.role]
this would allow me to later dynmically add and remove creeps

second I need a way to just run all my creeps regardless... maybe create a central
list of all the types of creeps and run as needed?


hard to write automatic rules when the basis of industry doesn't work

ok, so first off check controller level
if level 0, spawn list should be 4 generalists?

then from that point on energyCapacity?


damn, something like a trello board does sound like a good idea.

DONE:
second issue I need to do is I REALLY need to fix the ticks,
their inability to drop mine is frankly painfull.




*/


var runRoom = {
    run: function(RoomName, parentSpawnID) {
        //Spawn caps
        //TODO: make this dynamic
        //set by room level?  set by energy available?  how do I want to do this?
        //also, do I want to make this entirely dynamic?  lattice my extensions automatically?
        //what about defenses and storages?



        //room control methods
		var genericCount =0;
		var idlecreeps = [];
		var busyCreeps = [];
		var MyCreeps = [0,0,0,0]

        //TODO: search the room and find my towers.
        //runTower('59e01abdf8a4427bcdaccadd');
        //runTower('59e46bcf6075d0438a53234d');


        //set values
        myRoom = Game.rooms[RoomName];
        if(myRoom.memory.spawnList == undefined)
        {
          myRoom.memory.spawnList = [0,0,0,0]
        }
        var MaxMule = myRoom.memory.spawnList[0];
        var MaxTick = myRoom.memory.spawnList[1];
        var MaxGeneralist = myRoom.memory.spawnList[2];
        var MaxUpgrader =myRoom.memory.spawnList[3];
        //TODO: make the towers store turn by turn targeting as this eats CPU.
        myTowers = myRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        myTowers.forEach(x=>runTower(x.id));

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

            if(mySpawn.length>0)
            {
                console.log(mySpawn.length);
                myRoom.memory.mySpawn = mySpawn[0].id;
                mySpawn = mySpawn[0];
            }
            else
            {
                mySpawn = parentSpawnID;
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
        var i1=0;//TODO: clean this up
		    for(;i<idlecreeps.length;i++)
		    {
    		    //if I have idle creeps lets look for tasks, otherwise waste of cpu.
    		    //console.log('idle creeps: ' + idlecreeps.length);
    		    if(i1<jobs.length)
    		    {
    		        idlecreeps[i].say(jobs[i1][0]);
    		        idlecreeps[i].memory.action =jobs[i1][0];
    		        idlecreeps[i].memory.target =jobs[i1][1];
                //TODO: Currently doing this to rush each build, make this smarter.
                if(jobs[i1][0]=='build')
                {
                  i1--;
                }
                i1++;
    		    }
    		    else
    		    {
    		        //TODO: make the need change depending on room needs
    		        idlecreeps[i].memory.action ='deposit';
    		        if(myRoom.energyCapacityAvailable==myRoom.energyAvailable)
    		        {
    	              idlecreeps[i].memory.action ='upgrade';
    		        }
    		        idlecreeps[i].memory.target = myRoom.controller.id;
                idlecreeps[i].say(idlecreeps[i].memory.action);    		    }

		    }
		}

		//respawn code here
		if(mySpawn!="" && !mySpawn.spawning)
		{
    		if(MyCreeps[3] <MaxGeneralist)
    		{
    		    spawnGeneral(mySpawn.name,'generalist',RoomName,4);
    		}
    		if(MyCreeps[0]<MaxTick && mySpawn.room.energyAvailable >= 700)
    		{
    			//spawn tick
    			var name = mySpawn.createCreep( [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined,{role:'tick',myRoom:RoomName} );
    			console.log('Spawning: Tick '+ name + 'in room '+ RoomName );
    		}
    		if(MyCreeps[1]<MaxMule)
    		{
    			//spawn mule
    			spawnMule(mySpawn.name, RoomName);
//Game.spawns['Spawn.Prime'].createCreep( [CARRY, CARRY,MOVE,MOVE,CARRY, CARRY,MOVE,MOVE], undefined,{role:'mule'} );
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

function spawnMule(spawnPoint, roomName, max = 13)
{
    var top = Game.spawns[spawnPoint].room.energyCapacityAvailable;

    var loop = Math.floor(top/100);
    var i=0;
    var body = [];
	if(max<loop)
	{
		loop=max;
	}
	if(Game.spawns[spawnPoint].room.energyAvailable < loop*100)
	{
	    //console.log('Failed to spawn: '+typeOfSpawn + 'in '+roomName+ ' room has: ' +Game.spawns[spawnPoint].room.energyAvailable + ' / ' +Game.spawns[spawnPoint].room.energyCapacityAvailable + ' seeking: ' + loop*250);
	    return;
	}
    while(i<loop)
    {
        body.push(CARRY);
        body.push(MOVE);
        i++;
        //console.log('looped once: ' + i);
    }
	var name = Game.spawns[spawnPoint].createCreep( body, undefined,{role:"mule",myRoom:roomName} );
	console.log('Spawning: Mule, ' + name + ' size: ' + loop);
}

function runTower(towerID)
{
	var tower = Game.getObjectById(towerID);
	var minRepair = 1000;
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
