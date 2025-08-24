export class MCQQuestion {
  constructor(question, onAnswerSelect) {
    this.question = question;
    this.onAnswerSelect = onAnswerSelect;
    this.selectedOption = null;
  }

  render() {
    return `
      <div class="mcq-container">
        <div class="question-header">
          <div class="question-number">Question ${this.question.id}</div>
          <div class="question-text">${this.question.question}</div>
        </div>
        
        <div class="options-container">
          ${this.question.options.map(option => `
            <div class="option-card" data-option="${option.id}">
              <div class="option-radio">
                <div class="radio-circle"></div>
              </div>
              <div class="option-content">
                <div class="option-label">${option.id.toUpperCase()}</div>
                <div class="option-text">${option.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="question-actions">
          <button class="btn-next" id="next-btn" disabled>
            <span>Next Question</span>
            <svg class="arrow-icon" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Option selection
    document.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectOption(card.dataset.option);
      });
    });

    // Next button
    document.getElementById('next-btn').addEventListener('click', () => {
      if (this.selectedOption) {
        this.onAnswerSelect(this.selectedOption);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key >= 'a' && e.key <= 'd') {
        this.selectOption(e.key);
      } else if (e.key === 'Enter' && this.selectedOption) {
        this.onAnswerSelect(this.selectedOption);
      }
    });
  }

  selectOption(optionId) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Add selection to clicked option
    const selectedCard = document.querySelector(`[data-option="${optionId}"]`);
    selectedCard.classList.add('selected');
    
    this.selectedOption = optionId;
    
    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.classList.add('active');
  }

  cleanup() {
    // Remove event listeners if needed
  }
}
