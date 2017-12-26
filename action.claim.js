var actClaim = {

    /** @param {Creep} creep **/
    run: function(creep, claimer) {
        //console.log(Game.getObjectById(claimer));
        let x = creep.claimController(Game.getObjectById(claimer));
        //console.log(x)
        if(x == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(claimer));
        }
    }
};


module.exports = actClaim;
