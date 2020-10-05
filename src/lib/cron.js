const cron = require('node-cron');
//const {runShedulerForRewardPointsSummary} = require('../controllers/rewardPointsController');

        /*  * * * * * *
            | | | | | |
            | | | | | day of week
            | | | | month
            | | | day of month
            | | hour
            | minute
            second ( optional ) */

let cron_sheduler = cron.schedule('0 0 1 * *', () => {
    console.log('cron job running on every month at 00:00');
    runShedulerForRewardPointsSummary();
    
});

module.exports = cron_sheduler;
