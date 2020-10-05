const express = require('express');
const router = express.Router();
const doubtcontroller = require('../controllers/doubtController');

router.post('/savedoubt', doubtcontroller.savedoubt);
router.post('/getdoubts', doubtcontroller.getdoubts);
router.post('/saveanswer', doubtcontroller.saveanswer);

module.exports = router;