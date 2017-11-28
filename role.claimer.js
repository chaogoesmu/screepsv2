var actclaimer = require('action.claim');

module.exports = {
    run: function(creep) {
        actclaimer.run(creep, creep.memory.claimSpot)
    }
};