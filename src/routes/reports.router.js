const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.post('/getAllUploadedLessionsByTeacher', reportsController.getUplodedLessionsByTeacher);
router.post('/getAllDoubtClarifficationsByTeacher', reportsController.getAllTeacherDoubtClarifficationDetails);
router.post('/getAllTeacherAssignmentsByTeacher', reportsController.getAllTeacherAssignmentDetails);
router.post('/getAllTeacherSubjectsByStudent', reportsController.getAllTeacherSubjectsByStudent);
router.post('/getAllChapters', reportsController.getAllChapters);
router.post('/getAllAssignmentsByTeacher', reportsController.getAllAssignmentsByTeacher);
router.post('/getAllAssignmentsByTeacherStudent', reportsController.getAllAssignmentsByTeacherStudent);
router.post('/getAllAssignmentStatusByStudent', reportsController.getAllAssignmentStatusByStudent);
router.post('/getAllStudentStatusForListeningReadingAssignments', reportsController.getAllStudentStatusForListeningReadingAssignments);
router.post('/getAllStudentActivityStatus', reportsController.getAllStudentActivityStatus);

module.exports = router;