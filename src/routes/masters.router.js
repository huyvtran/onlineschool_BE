const express = require('express');
const router = express.Router();
const masterScreensController = require('../controllers/masterScreensController');

router.post('/getAllInstituteTypes', masterScreensController.getAllInstituteTypes);
router.post('/loadInstitutesByInstituteType', masterScreensController.loadInstitutesByInstituteType);
router.post('/loadCurriculumByInstitute', masterScreensController.loadCurriculumByInstitute);
router.post('/loadClassesByCurriculumAndInstitute', masterScreensController.loadClassesByCurriculumAndInstitute);
router.post('/loadSectionByClassesAndCurriculumAndInstitute', masterScreensController.loadSectionByClassesAndCurriculumAndInstitute);
router.post('/loadSubjectsByCurriculum', masterScreensController.loadSubjectsByCurriculum);
router.post('/loadTeachersByInstitute', masterScreensController.loadTeachersByInstitute);
router.post('/saveTeacherSubjects', masterScreensController.saveTeacherSubjects);

router.post('/saveTeacherMaster', masterScreensController.saveTeacherMaster);

module.exports = router;