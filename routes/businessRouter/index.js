const express = require('express');
const router = express.Router();

const businessController = require('../../controller/businessController');

router.get('/info', businessController.handleGetBusinessInfo);
router.get('/jobs', businessController.handleGetAllJobs);
router.post('/job/new', businessController.handlePostNewJob)
router.put('/job/edit', businessController.handlePutJob)
router.get('/job/skills/job_id', businessController.handleGetSkillsOfJob)
router.get('/job/request', businessController.getAllrequest);
router.post('/job/request/:job_id', businessController.aceptRequest);
router.get('/interns', businessController.getAllInternOfBusiness);

module.exports = router;