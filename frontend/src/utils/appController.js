import { AuthPage } from '../pages/AuthPage.js';
import { QuestionnairePage } from '../pages/QuestionnairePage.js';
import { apiService } from '../services/api.js';

export class AppController {
  constructor() {
    this.currentPage = null;
    this.currentUser = null;
  }

  async init() {
    await this.checkAuthStatus();
  }

  async checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Try to load questions to verify token is valid
        await apiService.getQuestions();
        // If successful, load user progress and show questionnaire
        await this.loadUserProgress();
        this.showQuestionnaire();
      } catch (error) {
        // Token is invalid, clear it and show auth
        localStorage.removeItem('token');
        this.showAuth();
      }
    } else {
      this.showAuth();
    }
  }

  async loadUserProgress() {
    try {
      const data = await apiService.getProgress();
      // Create a minimal user object for the questionnaire
      this.currentUser = {
        email: 'user@example.com', // This would come from the token in a real app
        currentQuestion: data.currentQuestion
      };
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }

  showAuth() {
    if (this.currentPage) {
      this.currentPage.cleanup();
    }

    this.currentPage = new AuthPage((user) => {
      this.currentUser = user;
      this.showQuestionnaire();
    });

    const app = document.querySelector('#app');
    app.innerHTML = this.currentPage.render();
    this.currentPage.setupEventListeners();
  }

  async showQuestionnaire() {
    if (this.currentPage) {
      this.currentPage.cleanup();
    }

    this.currentPage = new QuestionnairePage(this.currentUser, () => {
      this.handleLogout();
    });

    await this.currentPage.init();
  }

  handleLogout() {
    this.currentUser = null;
    localStorage.removeItem('token');
    this.showAuth();
  }
}
