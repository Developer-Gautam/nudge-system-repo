const User = require('../models/User');
const questions = require('../utils/questionsData');

const getQuestions = (req, res) => {
  res.json({ questions });
};

const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add answer to array
    user.answers[user.currentQuestion] = answer;
    user.currentQuestion += 1;
    user.lastActivity = new Date();
    
    await user.save();

    res.json({
      message: 'Answer submitted successfully',
      currentQuestion: user.currentQuestion,
      isComplete: user.currentQuestion >= 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      currentQuestion: user.currentQuestion,
      answers: user.answers,
      lastActivity: user.lastActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (user) {
      user.lastActivity = new Date();
      await user.save();
    }
    
    res.json({ message: 'Activity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuestions,
  submitAnswer,
  getProgress,
  updateActivity
};
