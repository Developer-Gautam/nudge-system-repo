import { apiService } from '../services/api.js';

export class AuthPage {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess;
    this.currentTab = 'login';
  }

  render() {
    return `
      <div id="auth-container" class="container">
        <div class="auth-box">
          <h1>Welcome to Nudge System</h1>
          <div class="auth-tabs">
            <button class="tab-btn active" data-tab="login">Login</button>
            <button class="tab-btn" data-tab="register">Register</button>
          </div>
          
          <!-- Login Form -->
          <form id="login-form" class="auth-form">
            <input type="email" id="login-email" placeholder="Email" required>
            <input type="password" id="login-password" placeholder="Password" required>
            <button type="submit">Login</button>
          </form>
          
          <!-- Register Form -->
          <form id="register-form" class="auth-form hidden">
            <input type="email" id="register-email" placeholder="Email" required>
            <input type="password" id="register-password" placeholder="Password" required>
            <input type="password" id="register-confirm-password" placeholder="Confirm Password" required>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Tab switching
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        this.switchTab(e.target.dataset.tab);
      }
    });

    // Login form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'login-form') {
        e.preventDefault();
        this.handleLogin();
      }
    });

    // Register form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'register-form') {
        e.preventDefault();
        this.handleRegister();
      }
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');

    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
    } else {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      loginTab.classList.remove('active');
      registerTab.classList.add('active');
    }
  }

  async handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const data = await apiService.login(email, password);
      localStorage.setItem('token', data.token);
      this.onAuthSuccess(data.user);
    } catch (error) {
      alert(error.message || 'Login failed');
    }
  }

  async handleRegister() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const data = await apiService.register(email, password);
      localStorage.setItem('token', data.token);
      this.onAuthSuccess(data.user);
    } catch (error) {
      alert(error.message || 'Registration failed');
    }
  }

  cleanup() {
    // Remove event listeners if needed
  }
}
