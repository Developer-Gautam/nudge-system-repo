export class NudgeModal {
  constructor() {
    this.onContinue = null;
    this.onDismiss = null;
  }

  render() {
    return `
      <div id="nudge-modal" class="modal hidden">
        <div class="modal-content">
          <h2>Hey there! 👋</h2>
          <p>It looks like you've been inactive for a while. Ready to continue with your questions?</p>
          <div class="modal-buttons">
            <button id="continue-btn" class="btn-primary">Continue</button>
            <button id="dismiss-btn" class="btn-secondary">Dismiss</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners(onContinue, onDismiss) {
    this.onContinue = onContinue;
    this.onDismiss = onDismiss;

    document.getElementById('continue-btn').addEventListener('click', () => {
      if (this.onContinue) this.onContinue();
    });

    document.getElementById('dismiss-btn').addEventListener('click', () => {
      if (this.onDismiss) this.onDismiss();
    });
  }

  show() {
    const modal = document.getElementById('nudge-modal');
    modal.classList.remove('hidden');
  }

  hide() {
    const modal = document.getElementById('nudge-modal');
    modal.classList.add('hidden');
  }

  cleanup() {
    this.onContinue = null;
    this.onDismiss = null;
  }
}
