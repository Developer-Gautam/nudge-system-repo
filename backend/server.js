const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nudge-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentQuestion: { type: Number, default: 0 },
  answers: [String],
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        currentQuestion: user.currentQuestion
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        currentQuestion: user.currentQuestion
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get questions
app.get('/api/questions', authenticateToken, (req, res) => {
  const questions = [
    {
      id: 1,
      question: "What is your favorite programming language?",
      options: [
        { id: 'a', text: 'JavaScript' },
        { id: 'b', text: 'Python' },
        { id: 'c', text: 'Java' },
        { id: 'd', text: 'C++' }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to spend your weekends?",
      options: [
        { id: 'a', text: 'Coding and learning new technologies' },
        { id: 'b', text: 'Outdoor activities and sports' },
        { id: 'c', text: 'Reading books and watching movies' },
        { id: 'd', text: 'Socializing with friends and family' }
      ]
    },
    {
      id: 3,
      question: "What's your dream vacation destination?",
      options: [
        { id: 'a', text: 'Tech hub cities (San Francisco, Tokyo)' },
        { id: 'b', text: 'Tropical beaches and islands' },
        { id: 'c', text: 'Historical cities and museums' },
        { id: 'd', text: 'Mountain retreats and nature' }
      ]
    },
    {
      id: 4,
      question: "What's your favorite type of music?",
      options: [
        { id: 'a', text: 'Electronic and EDM' },
        { id: 'b', text: 'Rock and Alternative' },
        { id: 'c', text: 'Classical and Jazz' },
        { id: 'd', text: 'Pop and Hip-hop' }
      ]
    },
    {
      id: 5,
      question: "How do you handle stress?",
      options: [
        { id: 'a', text: 'Solve problems systematically' },
        { id: 'b', text: 'Exercise and physical activity' },
        { id: 'c', text: 'Meditation and relaxation' },
        { id: 'd', text: 'Talk to friends and seek support' }
      ]
    },
    {
      id: 6,
      question: "What's your biggest goal for this year?",
      options: [
        { id: 'a', text: 'Learn new programming skills' },
        { id: 'b', text: 'Improve physical fitness' },
        { id: 'c', text: 'Read more books' },
        { id: 'd', text: 'Build stronger relationships' }
      ]
    },
    {
      id: 7,
      question: "What's your favorite way to exercise?",
      options: [
        { id: 'a', text: 'Gym workouts and strength training' },
        { id: 'b', text: 'Running and cardio' },
        { id: 'c', text: 'Yoga and flexibility' },
        { id: 'd', text: 'Team sports and games' }
      ]
    },
    {
      id: 8,
      question: "How do you prefer to learn new things?",
      options: [
        { id: 'a', text: 'Hands-on practice and experimentation' },
        { id: 'b', text: 'Video tutorials and courses' },
        { id: 'c', text: 'Reading documentation and books' },
        { id: 'd', text: 'Group discussions and collaboration' }
      ]
    },
    {
      id: 9,
      question: "What's your ideal work environment?",
      options: [
        { id: 'a', text: 'Quiet, focused space with minimal distractions' },
        { id: 'b', text: 'Collaborative open office with team interaction' },
        { id: 'c', text: 'Creative space with music and flexibility' },
        { id: 'd', text: 'Remote work with flexible hours' }
      ]
    },
    {
      id: 10,
      question: "What motivates you the most?",
      options: [
        { id: 'a', text: 'Solving complex problems and challenges' },
        { id: 'b', text: 'Achieving goals and recognition' },
        { id: 'c', text: 'Helping others and making a difference' },
        { id: 'd', text: 'Personal growth and self-improvement' }
      ]
    }
  ];
  
  res.json({ questions });
});

// Submit answer
app.post('/api/answer', authenticateToken, async (req, res) => {
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
});

// Update activity
app.post('/api/activity', authenticateToken, async (req, res) => {
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
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
