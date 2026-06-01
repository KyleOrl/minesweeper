// Audio Manager - Creates Web Audio API sounds for Minesweeper
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.masterVolume = 0.3;
        
        // Load preference from localStorage
        const savedPreference = localStorage.getItem('soundEnabled');
        if (savedPreference !== null) {
            this.enabled = savedPreference === 'true';
        }
        
        this.updateSoundButton();
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume context if suspended (required for user interaction)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        this.updateSoundButton();
    }

    updateSoundButton() {
        const btn = document.getElementById('soundToggle');
        if (btn) {
            btn.textContent = this.enabled ? '🔊 Sound On' : '🔇 Sound Off';
        }
    }

    play(frequency, duration, type = 'sine') {
        if (!this.enabled) return;

        this.initAudioContext();

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Click sound - cell reveal
    playClick() {
        this.play(800, 0.05);
    }

    // Flag sound
    playFlag() {
        this.play(1200, 0.08);
    }

    // Unflag sound
    playUnflag() {
        this.play(600, 0.06);
    }

    // Win sound - ascending notes
    playWin() {
        if (!this.enabled) return;
        this.play(523, 0.15); // C5
        setTimeout(() => this.play(659, 0.15), 100); // E5
        setTimeout(() => this.play(784, 0.3), 200); // G5
    }

    // Lose sound - descending notes
    playLose() {
        if (!this.enabled) return;
        this.play(784, 0.15); // G5
        setTimeout(() => this.play(659, 0.15), 100); // E5
        setTimeout(() => this.play(523, 0.3), 200); // C5
    }

    // Combo streak sound
    playCombo(level) {
        const baseFreq = 1000 + (level * 100);
        this.play(baseFreq, 0.1);
    }

    // Mine hit sound
    playMineHit() {
        if (!this.enabled) return;
        this.play(200, 0.2, 'sawtooth');
        setTimeout(() => this.play(150, 0.2, 'sawtooth'), 100);
    }

    // Celebration chime
    playChime() {
        if (!this.enabled) return;
        this.play(1047, 0.1); // C6
        setTimeout(() => this.play(1319, 0.1), 80); // E6
        setTimeout(() => this.play(1568, 0.2), 160); // G6
    }
}

// Create global audio manager
const audioManager = new AudioManager();

// Update sound toggle button
document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('soundToggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            audioManager.toggleSound();
        });
    }
});
