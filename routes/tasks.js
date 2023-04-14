const express = require('express');
const router = express.Router();
const { index, create, destroy } = require('../controllers/task.controller');
// Route to display all message boards
router.get('/projects/:id/tasks',index);

// Route to handle the message board creation form submission
router.post('/projects/:id/tasks',create);


router.delete('/projects/:projectId/tasks/:taskId',destroy);



module.exports = router;
