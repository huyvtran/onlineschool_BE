const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/getAllTeacherDetails', teacherController.getAllTeacherDetails);
router.post('/getCurriculumDetails', teacherController.getCurriculumDetails);
router.post('/getClassDetails', teacherController.getClassDetails);
router.post('/getSectionDetails', teacherController.getSectionDetails);
router.post('/getActivityDetails', teacherController.getActivityDetails);
router.post('/getTeacherSubjectDetails', teacherController.getTeacherSubjectDetails);
router.post('/getLessonDetails', teacherController.getLessonDetails);
router.post('/getLessonDetailsWithVideoStatus', teacherController.getLessonDetailsWithVideoStatus);
router.post('/getTeacherVideoStatus', teacherController.getTeacherVideoStatus);
router.post('/getLessonDetailsWithAssignmentStatus', teacherController.getLessonDetailsWithAssignmentStatus);
module.exports = router;