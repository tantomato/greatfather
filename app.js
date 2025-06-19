// Audio player functionality
class AudioPlayer {
    constructor() {
        this.audio = new Audio('otousankakkoii.mp3');
        this.playButton = document.getElementById('playButton');
        this.stopButton = document.getElementById('stopButton');
        this.errorMessage = document.getElementById('errorMessage');
        this.statusMessage = document.getElementById('statusMessage');
        this.statusText = document.getElementById('statusText');
        
        this.isPlaying = false;
        this.isLoading = false;
        this.hasError = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAudioEvents();
        this.updateUI();
        this.updateStatus('準備完了');
    }
    
    setupEventListeners() {
        this.playButton.addEventListener('click', () => {
            if (this.hasError) {
                this.retryLoad();
            } else if (this.isPlaying) {
                this.pauseAudio();
            } else {
                this.playAudio();
            }
        });
        
        this.stopButton.addEventListener('click', () => {
            this.stopAudio();
        });
    }
    
    setupAudioEvents() {
        this.audio.addEventListener('loadstart', () => {
            this.isLoading = true;
            this.hasError = false;
            this.updateStatus('読み込み中...');
            this.hideError();
            this.updateUI();
        });
        
        this.audio.addEventListener('canplay', () => {
            this.isLoading = false;
            this.hasError = false;
            this.updateStatus('準備完了');
            this.updateUI();
        });
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateUI();
            this.updateStatus('再生中');
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateUI();
            this.updateStatus('一時停止中');
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateUI();
            this.updateStatus('再生完了');
        });
        
        this.audio.addEventListener('error', (e) => {
            this.isLoading = false;
            this.isPlaying = false;
            this.hasError = true;
            this.updateUI();
            this.showError();
            this.updateStatus('エラー発生');
            console.error('Audio error:', e);
        });
        
        this.audio.addEventListener('loadeddata', () => {
            this.updateStatus('読み込み完了');
            this.hasError = false;
        });
    }
    
    playAudio() {
        if (this.isLoading || this.hasError) return;
        
        this.isLoading = true;
        this.updateUI();
        this.updateStatus('再生開始中...');
        
        this.audio.play().catch((error) => {
            console.error('Play failed:', error);
            this.isLoading = false;
            this.hasError = true;
            this.showError();
            this.updateStatus('再生エラー');
            this.updateUI();
        });
    }
    
    pauseAudio() {
        this.audio.pause();
    }
    
    stopAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updateUI();
        this.updateStatus('停止中');
    }
    
    retryLoad() {
        this.hasError = false;
        this.hideError();
        this.updateStatus('再試行中...');
        this.updateUI();
        
        // Create new audio instance to retry loading
        this.audio = new Audio('otousankakkoii.mp3');
        this.setupAudioEvents();
    }
    
    updateUI() {
        // Update play button
        if (this.hasError) {
            this.playButton.textContent = '再試行';
            this.playButton.disabled = false;
            this.playButton.classList.remove('btn-loading', 'active');
            this.playButton.classList.remove('btn--primary');
            this.playButton.classList.add('btn--secondary');
        } else if (this.isLoading) {
            this.playButton.textContent = '読み込み中...';
            this.playButton.disabled = true;
            this.playButton.classList.add('btn-loading', 'active');
            this.playButton.classList.add('btn--primary');
            this.playButton.classList.remove('btn--secondary');
        } else if (this.isPlaying) {
            this.playButton.textContent = '再生中...';
            this.playButton.classList.remove('btn-loading', 'active');
            this.playButton.disabled = false;
            this.playButton.classList.add('btn--primary');
            this.playButton.classList.remove('btn--secondary');
        } else {
            this.playButton.textContent = '音声を再生';
            this.playButton.classList.remove('btn-loading', 'active');
            this.playButton.disabled = false;
            this.playButton.classList.add('btn--primary');
            this.playButton.classList.remove('btn--secondary');
        }
        
        // Update stop button
        this.stopButton.disabled = !this.isPlaying;
    }
    
    showError() {
        this.errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
    
    updateStatus(message) {
        this.statusText.textContent = message;
        this.statusMessage.classList.remove('hidden');
        
        // Update status indicator color based on state
        const statusElement = this.statusMessage.querySelector('.status');
        statusElement.className = 'status';
        
        if (this.hasError) {
            statusElement.classList.add('status--error');
        } else if (this.isPlaying) {
            statusElement.classList.add('status--success');
        } else if (this.isLoading) {
            statusElement.classList.add('status--warning');
        } else {
            statusElement.classList.add('status--info');
        }
    }
}

// Initialize the audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
});

// Add some visual feedback for button interactions
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            if (!button.disabled) {
                button.style.transform = 'scale(0.98)';
            }
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
});
