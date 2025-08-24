import { apiService } from '../services/api.js';
import { activityTracker } from '../utils/activityTracker.js';
import { NudgeModal } from '../components/NudgeModal.js';

export class QuestionnairePage {
  constructor(user, onLogout) {
    this.user = user;
    this.onLogout = onLogout;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.nudgeModal = new NudgeModal();
  }

  async init() {
    await this.loadQuestions();
    await this.loadProgress();
    this.render();
    this.setupEventListeners();
    this.startActivityTracking();
  }

  async loadQuestions() {
    try {
      const data = await apiService.getQuestions();
      this.questions = data.questions;
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  async loadProgress() {
    try {
      const data = await apiService.getProgress();
      this.currentQuestionIndex = data.currentQuestion;
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  render() {
    const app = document.querySelector('#app');
    app.innerHTML = `
      <div id="main-container" class="container">
        <header class="header">
          <h1>Questionnaire</h1>
          <div class="user-info">
            <span id="user-email">${this.user.email}</span>
            <button id="logout-btn">Logout</button>
          </div>
        </header>

        <main class="main-content">
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
            <span class="progress-text" id="progress-text">${this.currentQuestionIndex}/10</span>
          </div>

          <div class="question-container">
            <h2 id="question-text">${this.questions[this.currentQuestionIndex] || 'Loading...'}</h2>
            <form id="answer-form">
              <textarea id="answer-input" placeholder="Type your answer here..." rows="4"></textarea>
              <button type="submit" id="submit-btn">Submit Answer</button>
            </form>
          </div>

          <div class="completion-message hidden" id="completion-message">
            <h2>🎉 Congratulations!</h2>
            <p>You've completed all the questions!</p>
            <button id="restart-btn">Start Over</button>
          </div>
        </main>
      </div>

      ${this.nudgeModal.render()}
    `;

    this.updateProgress();
  }

  setupEventListeners() {
    // Logout
    document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));

    // Answer form
    document.getElementById('answer-form').addEventListener('submit', this.handleAnswerSubmit.bind(this));

    // Restart button
    document.getElementById('restart-btn').addEventListener('click', this.handleRestart.bind(this));

    // Nudge modal
    this.nudgeModal.setupEventListeners(
      this.handleContinue.bind(this),
      this.handleDismiss.bind(this)
    );
  }

  startActivityTracking() {
    activityTracker.startTracking(() => {
      this.nudgeModal.show();
    });
  }

  updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progress = (this.currentQuestionIndex / 10) * 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${this.currentQuestionIndex}/10`;
  }

  updateQuestion() {
    const questionText = document.getElementById('question-text');
    if (this.currentQuestionIndex < this.questions.length) {
      questionText.textContent = this.questions[this.currentQuestionIndex];
    }
  }

  async handleAnswerSubmit(e) {
    e.preventDefault();
    
    const answer = document.getElementById('answer-input').value.trim();
    if (!answer) {
      alert('Please enter an answer');
      return;
    }

    try {
      const data = await apiService.submitAnswer(answer);
      this.currentQuestionIndex = data.currentQuestion;
      
      if (data.isComplete) {
        this.showCompletionMessage();
      } else {
        this.updateQuestion();
        this.updateProgress();
        activityTracker.resetTimer();
      }
      
      document.getElementById('answer-input').value = '';
    } catch (error) {
      alert(error.message || 'Failed to submit answer');
    }
  }

  showCompletionMessage() {
    document.querySelector('.question-container').classList.add('hidden');
    document.getElementById('completion-message').classList.remove('hidden');
    activityTracker.stopTracking();
  }

  handleRestart() {
    this.currentQuestionIndex = 0;
    document.querySelector('.question-container').classList.remove('hidden');
    document.getElementById('completion-message').classList.add('hidden');
    this.updateQuestion();
    this.updateProgress();
    this.startActivityTracking();
  }

  handleLogout() {
    activityTracker.stopTracking();
    this.onLogout();
  }

  handleContinue() {
    this.nudgeModal.hide();
    activityTracker.resetTimer();
  }

  handleDismiss() {
    this.nudgeModal.hide();
    activityTracker.resetTimer();
  }

  cleanup() {
    activityTracker.stopTracking();
    this.nudgeModal.cleanup();
  }
}
