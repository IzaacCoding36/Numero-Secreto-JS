class SecretNumberGame {
    constructor() {
        this.numeroMaximo = 5000;
        this.numeroSecreto = null;
        this.tentativas = 0;
        this.gameActive = false;
        
        this.elements = {
            gameArea: document.getElementById('gameArea'),
            victoryArea: document.getElementById('victoryArea'),
            guessForm: document.getElementById('guessForm'),
            guessInput: document.getElementById('guessInput'),
            feedback: document.getElementById('feedback'),
            attemptCount: document.getElementById('attemptCount'),
            victoryMessage: document.getElementById('victoryMessage'),
            newGameBtn: document.getElementById('newGameBtn'),
            maxNumber: document.getElementById('maxNumber'),
            minNumber: document.getElementById('minNumber')
        };
        
        this.init();
    }
    
    init() {
        this.elements.maxNumber.textContent = this.numeroMaximo;
        this.elements.guessInput.max = this.numeroMaximo;
        this.startNewGame();
        this.bindEvents();
    }
    
    bindEvents() {
        this.elements.guessForm.addEventListener('submit', (e) => this.handleGuess(e));
        this.elements.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.elements.guessInput.addEventListener('input', () => this.clearFeedback());
    }
    
    startNewGame() {
        this.numeroSecreto = Math.floor(Math.random() * this.numeroMaximo) + 1;
        this.tentativas = 0;
        this.gameActive = true;
        
        // Reset UI
        this.elements.gameArea.classList.remove('hidden');
        this.elements.victoryArea.classList.add('hidden');
        this.elements.guessInput.value = '';
        this.elements.guessInput.disabled = false;
        this.clearFeedback();
        this.updateAttemptCount();
        this.elements.guessInput.focus();
        
        // For development only - remove in production
        // console.log('Número secreto:', this.numeroSecreto);
    }
    
    handleGuess(event) {
        event.preventDefault();
        
        if (!this.gameActive) return;
        
        const chute = parseInt(this.elements.guessInput.value);
        
        if (!this.isValidGuess(chute)) {
            this.showFeedback('Por favor, digite um número válido entre 1 e ' + this.numeroMaximo, 'error');
            return;
        }
        
        this.tentativas++;
        this.updateAttemptCount();
        
        if (chute === this.numeroSecreto) {
            this.handleVictory();
        } else {
            this.handleIncorrectGuess(chute);
        }
        
        this.elements.guessInput.value = '';
        this.elements.guessInput.focus();
    }
    
    isValidGuess(chute) {
        return !isNaN(chute) && chute >= 1 && chute <= this.numeroMaximo;
    }
    
    handleVictory() {
        this.gameActive = false;
        this.elements.guessInput.disabled = true;
        
        const palavraTentativa = this.tentativas > 1 ? 'tentativas' : 'tentativa';
        const message = `Você descobriu o número secreto ${this.numeroSecreto} com ${this.tentativas} ${palavraTentativa}!`;
        
        this.showFeedback('🎉 Parabéns! Você acertou!', 'success');
        
        setTimeout(() => {
            this.elements.gameArea.classList.add('hidden');
            this.elements.victoryArea.classList.remove('hidden');
            this.elements.victoryMessage.textContent = message;
        }, 1500);
    }
    
    handleIncorrectGuess(chute) {
        let message;
        let feedbackClass = 'hint';
        
        if (chute > this.numeroSecreto) {
            message = `📉 O número secreto é menor que ${chute}`;
        } else {
            message = `📈 O número secreto é maior que ${chute}`;
        }
        
        // Add difficulty hints
        const difference = Math.abs(chute - this.numeroSecreto);
        if (difference <= 10) {
            message += ' - Você está muito perto! 🔥';
        } else if (difference <= 50) {
            message += ' - Você está perto! 👀';
        } else if (difference <= 100) {
            message += ' - Você está morno... 🤔';
        } else {
            message += ' - Você está frio! ❄️';
        }
        
        this.showFeedback(message, feedbackClass);
    }
    
    showFeedback(message, type = '') {
        this.elements.feedback.textContent = message;
        this.elements.feedback.className = `container__feedback ${type}`;
        
        // Add animation
        this.elements.feedback.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.feedback.style.transform = 'scale(1)';
        }, 100);
    }
    
    clearFeedback() {
        this.elements.feedback.textContent = '';
        this.elements.feedback.className = 'container__feedback';
    }
    
    updateAttemptCount() {
        this.elements.attemptCount.textContent = this.tentativas;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecretNumberGame();
});