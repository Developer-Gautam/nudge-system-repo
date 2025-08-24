export class MCQQuestion {
  constructor(question, onAnswerSelect) {
    this.question = question;
    this.onAnswerSelect = onAnswerSelect;
    this.selectedOption = null;
    this.eventListeners = [];
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
    this.cleanup(); // Clear any existing listeners

    // Option selection
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
      const listener = (e) => {
        this.selectOption(card.dataset.option);
      };
      card.addEventListener('click', listener);
      this.eventListeners.push({ element: card, event: 'click', listener });
    });

    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      const listener = () => {
        if (this.selectedOption) {
          this.onAnswerSelect(this.selectedOption);
        }
      };
      nextBtn.addEventListener('click', listener);
      this.eventListeners.push({ element: nextBtn, event: 'click', listener });
    }

    // Keyboard navigation
    const keyListener = (e) => {
      if (e.key >= 'a' && e.key <= 'd') {
        this.selectOption(e.key);
      } else if (e.key === 'Enter' && this.selectedOption) {
        this.onAnswerSelect(this.selectedOption);
      }
    };
    document.addEventListener('keydown', keyListener);
    this.eventListeners.push({ element: document, event: 'keydown', listener: keyListener });
  }

  selectOption(optionId) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Add selection to clicked option
    const selectedCard = document.querySelector(`[data-option="${optionId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
    
    this.selectedOption = optionId;
    
    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
    }
  }

  cleanup() {
    // Remove all event listeners
    this.eventListeners.forEach(({ element, event, listener }) => {
      element.removeEventListener(event, listener);
    });
    this.eventListeners = [];
  }
}
