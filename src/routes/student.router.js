
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


router.post('/getAllStudentDetails', studentController.getAllStudentDetails);
router.post('/getFiles', studentController.getFiles);
router.post('/downloadPDF', studentController.downloadPDF);
router.post('/getStudentSubjectDetails', studentController.getStudentSubjectDetails);
router.post('/getStudentLessonDetailsWithListeningStatus', studentController.getStudentLessonDetailsWithListeningStatus);
router.post('/getStudentLessonDetailsWithReadingStatus', studentController.getStudentLessonDetailsWithReadingStatus);
router.post('/getVideoDetailsByLesson', studentController.getVideoDetailsByLesson);
router.post('/saveStudentListenings', studentController.saveStudentListenings);
router.post('/getCurriculumNameById', studentController.getCurriculumNameById);
router.post('/getClassNameById', studentController.getClassNameById);
router.get('/downloadLessonPdf', studentController.downloadLessonPdf);
router.post('/saveStudentReadings', studentController.saveStudentReadings);
router.post('/readLessonPdf', studentController.readLessonPdf);
router.post('/getStudentReadingRecord', studentController.getStudentReadingRecord);
router.post('/getStudentLessonDetailsWithAssignmentStatus', studentController.getStudentLessonDetailsWithAssignmentStatus);

router.post('/saveActivities', studentController.saveActivities);
router.post('/saveAlActivities', studentController.saveAlActivities);

module.exports = router;