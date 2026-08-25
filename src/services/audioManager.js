// CodeSaga Centralized Retro Web Audio Manager
import useStore from '../store/useStore';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.hasUserInteracted = false;
    this.lastVoiceTime = 0;
    this.voiceDebounceMs = 400;

    // Listen for initial user interaction gesture
    this.initOnGesture = this.initOnGesture.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.initOnGesture, { once: true });
      window.addEventListener('keydown', this.initOnGesture, { once: true });
      window.addEventListener('pointerdown', this.initOnGesture, { once: true });
      window.addEventListener('touchstart', this.initOnGesture, { once: true });
    }
  }

  initOnGesture() {
    this.hasUserInteracted = true;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch (e) {
          console.warn('AudioContext creation deferred:', e);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  ensureContext() {
    // Only attempt creation if user has interacted to prevent autoplay warnings
    if (!this.hasUserInteracted) {
      return null;
    }
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch (e) {
          return null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx && this.ctx.state === 'running' ? this.ctx : null;
  }

  shouldPlay() {
    const store = useStore.getState();
    if (store.isMuted || store.sfxVolume <= 0) return false;
    return this.hasUserInteracted;
  }

  getVolume() {
    const store = useStore.getState();
    return store.sfxVolume || 0.8;
  }

  // Play a simple synthesized tone safely
  playTone(freq, duration, type = 'square', gainValue = 0.1, freqRamp = null) {
    if (!this.shouldPlay()) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      if (freqRamp) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqRamp, 20), ctx.currentTime + duration);
      }

      const masterVol = this.getVolume();
      const volume = gainValue * masterVol;

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio errors must never crash the app
    }
  }

  // ---------------- UI SOUNDS ---------------- //

  playHover() {
    this.playTone(320, 0.05, 'triangle', 0.05);
  }

  playClick() {
    this.playTone(580, 0.08, 'square', 0.12, 220);
  }

  playDisabled() {
    this.playTone(150, 0.1, 'sawtooth', 0.08, 90);
  }

  playMenuOpen() {
    this.playTone(300, 0.1, 'square', 0.08, 600);
  }

  playMenuClose() {
    this.playTone(600, 0.1, 'square', 0.08, 300);
  }

  playTabSwitch() {
    this.playTone(450, 0.06, 'triangle', 0.07);
  }

  playBack() {
    this.playTone(400, 0.09, 'triangle', 0.08, 200);
  }

  playContinue() {
    if (!this.shouldPlay()) return;
    this.playTone(440, 0.08, 'square', 0.1);
    setTimeout(() => this.playTone(660, 0.12, 'square', 0.12), 80);
  }

  playSuccess() {
    if (!this.shouldPlay()) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.12), idx * 70);
    });
  }

  playError() {
    if (!this.shouldPlay()) return;
    this.playTone(220, 0.15, 'sawtooth', 0.15, 110);
    setTimeout(() => this.playTone(180, 0.2, 'sawtooth', 0.15, 90), 120);
  }

  playWarning() {
    this.playTone(440, 0.1, 'square', 0.1);
    setTimeout(() => this.playTone(440, 0.1, 'square', 0.1), 120);
  }

  playNotification() {
    this.playTone(880, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(1760, 0.12, 'sine', 0.12), 90);
  }

  playModal() {
    this.playTone(350, 0.1, 'triangle', 0.08, 500);
  }

  // ---------------- GAME SOUNDS ---------------- //

  playMissionStart() {
    const notes = [392, 523.25, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 'square', 0.1), i * 90);
    });
  }

  playMissionComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'square', 0.15), i * 80);
    });
  }

  playXpGained() {
    this.playTone(600, 0.06, 'sine', 0.1, 900);
    setTimeout(() => this.playTone(900, 0.08, 'sine', 0.12, 1200), 50);
  }

  playLevelUp() {
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.14, 'square', 0.15), i * 70);
    });
  }

  playCoinReceived() {
    this.playTone(987.77, 0.08, 'square', 0.12);
    setTimeout(() => this.playTone(1318.51, 0.25, 'square', 0.15), 70);
  }

  playCorrectSql() {
    this.playTone(523.25, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.15), 90);
  }

  playWrongSql() {
    this.playTone(261.63, 0.15, 'sawtooth', 0.15, 130.81);
  }

  playHintOpened() {
    const notes = [659.25, 783.99, 987.77];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.08, 'triangle', 0.1), i * 60);
    });
  }

  playBossEncounter() {
    this.playTone(130.81, 0.3, 'sawtooth', 0.2, 65.41);
    setTimeout(() => this.playTone(110, 0.4, 'sawtooth', 0.2, 55), 250);
  }

  playChapterUnlocked() {
    const notes = [349.23, 440, 523.25, 698.46];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'square', 0.12), i * 80);
    });
  }

  playChapterCompleted() {
    this.playSuccess();
  }

  playCharacterSelected() {
    this.playTone(440, 0.08, 'square', 0.15, 880);
    setTimeout(() => this.playTone(880, 0.15, 'square', 0.15, 1320), 80);
  }

  playWorldSelected() {
    this.playTone(300, 0.12, 'triangle', 0.12, 900);
  }

  // ---------------- CHARACTER VOICES (CHIRPS) ---------------- //

  playMaleVoice() {
    const now = Date.now();
    if (now - this.lastVoiceTime < this.voiceDebounceMs) return;
    this.lastVoiceTime = now;

    if (!this.shouldPlay()) return;

    const voiceTypes = [
      () => this.playTone(180, 0.09, 'sawtooth', 0.12, 280),
      () => this.playTone(240, 0.1, 'square', 0.14, 160),
      () => {
        this.playTone(200, 0.06, 'sawtooth', 0.12);
        setTimeout(() => this.playTone(320, 0.09, 'sawtooth', 0.12), 60);
      },
      () => {
        this.playTone(220, 0.06, 'square', 0.12);
        setTimeout(() => this.playTone(350, 0.12, 'square', 0.14), 60);
      }
    ];

    const pick = voiceTypes[Math.floor(Math.random() * voiceTypes.length)];
    pick();
  }

  playFemaleVoice() {
    const now = Date.now();
    if (now - this.lastVoiceTime < this.voiceDebounceMs) return;
    this.lastVoiceTime = now;

    if (!this.shouldPlay()) return;

    const voiceTypes = [
      () => this.playTone(420, 0.08, 'triangle', 0.12, 540),
      () => this.playTone(520, 0.09, 'sine', 0.12, 620),
      () => {
        this.playTone(400, 0.06, 'triangle', 0.11);
        setTimeout(() => this.playTone(580, 0.1, 'triangle', 0.12), 60);
      },
      () => {
        this.playTone(450, 0.06, 'sine', 0.12);
        setTimeout(() => this.playTone(680, 0.12, 'sine', 0.14), 60);
      }
    ];

    const pick = voiceTypes[Math.floor(Math.random() * voiceTypes.length)];
    pick();
  }
}

const audioManager = new AudioManager();
export default audioManager;
