import { apiService } from '../services/api.js';
import { activityTracker } from '../utils/activityTracker.js';
import { NudgeModal } from '../components/NudgeModal.js';
import { MCQQuestion } from '../components/MCQQuestion.js';

export class QuestionnairePage {
  constructor(user, onLogout) {
    this.user = user;
    this.onLogout = onLogout;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.nudgeModal = new NudgeModal();
    this.mcqComponent = null;
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
          <h1>Personality Quiz</h1>
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

          <div class="progress-indicator">
            ${this.questions.map((_, index) => `
              <div class="progress-dot ${index < this.currentQuestionIndex ? 'completed' : index === this.currentQuestionIndex ? 'active' : ''}"></div>
            `).join('')}
          </div>

          <div class="question-container" id="question-container">
            ${this.currentQuestionIndex < this.questions.length ? 
              this.renderCurrentQuestion() : 
              '<div class="loading">Loading...</div>'
            }
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
    this.updateProgressIndicator();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      this.mcqComponent = new MCQQuestion(question, (answer) => {
        this.handleAnswerSubmit(answer);
      });
      return this.mcqComponent.render();
    }
    return '';
  }

  setupEventListeners() {
    // Logout
    document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));

    // Restart button
    document.getElementById('restart-btn').addEventListener('click', this.handleRestart.bind(this));

    // Nudge modal
    this.nudgeModal.setupEventListeners(
      this.handleContinue.bind(this),
      this.handleDismiss.bind(this)
    );

    // Setup MCQ component event listeners
    if (this.mcqComponent) {
      this.mcqComponent.setupEventListeners();
    }
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

  updateProgressIndicator() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      if (index < this.currentQuestionIndex) {
        dot.classList.add('completed');
      } else if (index === this.currentQuestionIndex) {
        dot.classList.add('active');
      }
    });
  }

  updateQuestion() {
    const questionContainer = document.getElementById('question-container');
    if (this.currentQuestionIndex < this.questions.length) {
      questionContainer.innerHTML = this.renderCurrentQuestion();
      if (this.mcqComponent) {
        this.mcqComponent.setupEventListeners();
      }
    }
  }

  async handleAnswerSubmit(answer) {
    try {
      const data = await apiService.submitAnswer(answer);
      this.currentQuestionIndex = data.currentQuestion;
      
      if (data.isComplete) {
        this.showCompletionMessage();
      } else {
        this.updateQuestion();
        this.updateProgress();
        this.updateProgressIndicator();
        activityTracker.resetTimer();
      }
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
    this.updateProgressIndicator();
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
