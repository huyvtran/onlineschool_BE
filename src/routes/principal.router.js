const express = require('express');
const router = express.Router();
const principal = require('../controllers/principal.controller');

router.post('/getstudentoverview', principal.getstudentoverview);
router.post('/getsubjectoverview', principal.getsubjectoverview);
router.post('/getacademicoverview', principal.getacademicoverview);
router.post('/getstudentwisedata', principal.getstudentwisedata);
router.post('/getCurriculumByInstId', principal.getCurriculumByInstId);
router.post('/getClassesByInstCurId', principal.getClassesByInstCurId);
router.post('/getsectionsByInstCurClassId', principal.getsectionsByInstCurClassId);
router.post('/getStudentsByInstCurClassSecId', principal.getStudentsByInstCurClassSecId);
router.post('/getTeachersByInstId', principal.getTeachersByInstId);
router.post('/getStudentGrapicalData', principal.getStudentGrapicalData);
router.post('/getTeachersGraphicalData', principal.getTeachersGraphicalData);

module.exports = router;