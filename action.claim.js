var actClaim = {

    /** @param {Creep} creep **/
    run: function(creep, claimer) {
        //console.log(Game.getObjectById(claimer));
        if(creep.claimController(Game.getObjectById(claimer)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(claimer));
        }
    }
};


module.exports = actClaim;