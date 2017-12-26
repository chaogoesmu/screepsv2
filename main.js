var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var roleMule = require('role.mule');
var roleTick = require('role.tick');
var roleForager = require('role.forager');
var roleClaimer = require('role.claimer');
var roomControl = require('room.alpha');


module.exports.loop = function () {

    roomControl.run('E44N38');
    roomControl.run('E44N37');

    var MaxHarvest = 0;
    var MaxBuilder = 0;
    var MaxUpgrader = 0;
    var MaxFixer =0;
    var MaxMule = 0;
    var MaxTick = 0;
    var MaxForager =0;
    var MaxLDMule = 0;
    var MaxLDTick = 0;
    var MaxForager3 =0;
    var MaxForager5 =0;
    RoomName = 'E44N38';
    //go through all the creeps and find the ones under control for this room
	var ThisRoomsCreeps = Game.creeps;
    //console.log('Game.spawns ' + Game.spawns['Spawn.pizza'].room);
	ThisRoomsCreeps = _(ThisRoomsCreeps).filter({memory: {myRoom: RoomName}}).value();
  runTower('5a3ecdd67b47ce79fbfa45cf');

    if(Game.spawns['Spawn.Prime'].room.energyCapacityAvailable > 1100)
    {
        //mehhhhh
    }


        runTower('...');

    	for(let name in Memory.creeps)
    	{
    		if(Game.creeps[name]==undefined)
    		{
    			delete Memory.creeps[name];
    		}
    	}


    	var MyCreeps = [0,0,0,0,0,0,0,0,0,0,0];
        for(var name in ThisRoomsCreeps) {
            var creep = ThisRoomsCreeps[name];
    		switch(creep.memory.role){
                case 'harvester':
                    roleHarvester.run(creep);
        			MyCreeps[0]+=1;
        			break;
                case 'upgrader':
                    roleUpgrader.run(creep);
        			MyCreeps[1]+=1;
        			break;
                case 'builder':
                    roleBuilder.run(creep);
        			MyCreeps[2]+=1;
                    break;
                case 'fixer':
                    roleFixer.run(creep);
        			MyCreeps[3]+=1;
                    break;
                case 'mule':
                    roleMule.run(creep);
        			MyCreeps[4]+=1;
                    break;
                case 'tick':
                    roleTick.run(creep);
        			MyCreeps[5]+=1;
                    break;
                case 'forager':
                    if(creep.memory.MyTravel == 1)
                    {
                        MyCreeps[6]+=1;
                        roleForager.run(creep);

                    }
                    if(creep.memory.MyTravel == 5)
                    {
                        MyCreeps[10]+=1;
                        roleForager.run(creep);
                    }
                    if(creep.memory.MyTravel == 3)
                    {
                        MyCreeps[9]+=1;
                        roleForager.run(creep);
                    }
                    break;
                case "claimer":
                    roleClaimer.run(creep);
                    break;
        		default:
        		break;
    		}
        }

    	if (!Game.spawns['Spawn.Prime'].spawning)
    	{
    	    //console.log(MyCreeps.toString());
    		if(MyCreeps[4]<MaxMule )// && Game.spawns['Spawn.Prime'].room.energyAvailable > 1100
    		{
    			//spawn mule
    			var name =
    			//var name = Game.spawns['Spawn.Prime'].createCreep( [CARRY, CARRY,MOVE,MOVE,CARRY, CARRY,MOVE,MOVE], undefined,{role:'mule'} );
    			console.log('Spawning: Mule '+ name);
    		}
    		else
    		{
    			if(MyCreeps[5]<MaxTick)// && Game.spawns['Spawn.Prime'].room.energyAvailable > 700
    			{
    				//spawn tick
    				var name = Game.spawns['Spawn.Prime'].createCreep( [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined,{role:'tick',myRoom:'E19S33'} );
    				console.log('Spawning: Tick '+ name);
    			}
    			else
    			{
    				if(MyCreeps[0]<MaxHarvest )//&& Game.spawns['Spawn.Prime'].room.energyAvailable > 2000
    				{
    					spawnGeneral('Spawn.Prime', 'harvester',8);
    				}
    				else
    				{
    					if(MyCreeps[1]<MaxUpgrader)// && Game.spawns['Spawn.Prime'].room.energyAvailable > 2000
    					{
    						spawnGeneral('Spawn.Prime', 'upgrader',6);
    					}
    					else
    					{
    						if(MyCreeps[2]<MaxBuilder)// && Game.spawns['Spawn.Prime'].room.energyAvailable > 2500
    						{
    						    //console.log(MaxBuilder + '/' + MyCreeps[2]);
    							spawnGeneral('Spawn.Prime', 'builder', 6);
    						}
    						else
    						{
    							if(MyCreeps[3]<MaxFixer )// && Game.spawns['Spawn.Prime'].room.energyAvailable > 750
    							{
    								spawnGeneral('Spawn.Prime', 'fixer',3);
    							}
    							else
    							{
                		    		if(MyCreeps[6]<MaxForager && Game.spawns['Spawn.Prime'].room.energyAvailable > 250)
                            		{
                            			//spawn tick
                            			var name = Game.spawns['Spawn.Prime'].createCreep( [WORK, CARRY,  MOVE, MOVE], undefined,{role:'forager', MyHome:Game.spawns['Spawn.Prime'].room.name, MyTravel: 1,myRoom:'E19S33'} );
                            			console.log('Spawning: Forager '+ name);
                            		}
                            		else
                            		{
                    		    		if(MyCreeps[8]<MaxLDMule  && Game.spawns['Spawn.Prime'].room.energyAvailable > 250)
                                		{
                                			//spawn harvester
                                			var name = Game.spawns['Spawn.Prime'].createCreep( [CARRY, CARRY,MOVE,MOVE], undefined,{role:'ldmule'} );
                                			console.log('Spawning: Mule '+ name);
                                		}
                                		else
                                		{
                        		    		if(MyCreeps[7]<MaxLDTick && Game.spawns['Spawn.Prime'].room.energyAvailable > 400)
                                    		{
                                    			//spawn harvester
                                    			var name = Game.spawns['Spawn.Prime'].createCreep( [WORK, WORK, WORK ,MOVE,MOVE], undefined,{role:'ldtick'} );
                                    			console.log('Spawning: Mule '+ name);
                                    		}
                                    		else
                                    		{
                            		    		if(MyCreeps[9]<MaxForager3  && Game.spawns['Spawn.Prime'].room.energyAvailable > 800)
                                        		{
                                        			//spawn tick
                                        			var name = Game.spawns['Spawn.Prime'].createCreep( [WORK, WORK, CARRY, CARRY,WORK, WORK, CARRY, CARRY,  MOVE,MOVE,  MOVE,MOVE], undefined,
                                        			    {role:'forager', MyHome:Game.spawns['Spawn.Prime'].room.name, MyTravel: 3,myRoom:'E19S33'} );
                                        			console.log('Spawning: Forager '+ name);
                                        		}
                                    		    else
                                    		    {
                                		    		if(MyCreeps[10]<MaxForager5  && Game.spawns['Spawn.Prime'].room.energyAvailable > 1000)
                                            		{
                                            			//spawn forager direction 5, this is temporary to just be an annoyance to littleBird.
                                            			var name = Game.spawns['Spawn.Prime'].createCreep( [ WORK, CARRY, CARRY,  MOVE,MOVE], undefined,{role:'forager', MyHome:Game.spawns['Spawn.Prime'].room.name, MyTravel: 5,myRoom:'E44N38'} );
                                            			console.log('Spawning: Forager '+ name);

    												}
    											}
    										}
    									}
    								}
    							}
    						}
    					}
    				}
    			}
    		}
    	}
    	else
    	{
    	    if(MyCreeps[4]<1 && MyCreeps[5]<1 && MyCreeps[0]<5)//just in case, if there are no ticks, harvesters or mules, spawn a harvester
    	    {
    	        Game.spawns['Spawn.Prime'].createCreep( [WORK, CARRY,MOVE,MOVE], undefined,{role:'harvester'} );
    	    }

    }

    //roomControl.run('E19S34');

}

function spawnGeneral(spawnPoint, typeOfSpawn, max = 13)
{
    var top = Game.spawns[spawnPoint].room.energyCapacityAvailable;

    var loop = Math.floor(top/250);
    var i=0;
    var body = [];
	if(max<loop)
	{
		loop=max;
	}
	if(Game.spawns['Spawn.Prime'].room.energyAvailable < loop*250)
	{
	    //console.log('Failed to spawn: '+typeOfSpawn + ' room has: ' +Game.spawns['Spawn.Prime'].room.energyAvailable + ' / ' +Game.spawns[spawnPoint].room.energyCapacityAvailable + ' seeking: ' + loop*250);
	    return;
	}
    while(i<loop)
    {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        body.push(MOVE);
        i++;
        //console.log('looped once: ' + i);
    }
	var name = Game.spawns[spawnPoint].createCreep( body, undefined,{role:typeOfSpawn,myRoom:'E19S33'} );
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
