const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { 
  getQuestions, 
  submitAnswer, 
  getProgress, 
  updateActivity 
} = require('../controllers/questionController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get questions
router.get('/questions', getQuestions);

// Submit answer
router.post('/answer', submitAnswer);

// Get user progress
router.get('/progress', getProgress);

// Update activity
router.post('/activity', updateActivity);

module.exports = router;
