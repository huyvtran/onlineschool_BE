const express = require('express');
const router = express.Router();
const assignment = require('../controllers/assignmentController');


router.post('/saveassignment', assignment.addasignment);
router.post('/getmodelqtns', assignment.getmodelquestions);
router.post('/getaddedassignments', assignment.getaddedassignments);
router.post('/getassignmentbyid', assignment.getassignmetsdatabyid);
router.post('/saveassignbyid',assignment.saveassignbyid);
router.post('/updateassignmentstatus',assignment.updateassignstatus);

router.post('/getassignmentsforstudents',assignment.fetchassignmetsforstudents);
router.post('/getassignmentbyidforstudent',assignment.fetchassignmetbyid);
router.post('/saveassignmentsubmission',assignment.saveassignsubmission);
router.post('/getresults',assignment.getstudentresults);

module.exports = router;