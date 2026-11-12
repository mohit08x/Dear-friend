/**
 * Native Web Audio API ambient melody synthesizer for friendship keepsake.
 * 100% resilient and self-contained with no external audio dependencies.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentTrack: string = 'memories';
  private volume: number = 0.4;

  // Chord notes in Hz
  private scales: Record<string, { chords: number[][]; tempo: number }> = {
    memories: {
      // D major peaceful progression: D - A - Bm - F#m - G - D - Em - A
      chords: [
        [293.66, 369.99, 440.0, 587.33], // D maj (D4, F#4, A4, D5)
        [220.0, 329.63, 440.0, 554.37],  // A maj (A3, E4, A4, C#5)
        [246.94, 293.66, 369.99, 493.88],// B min (B3, D4, F#4, B4)
        [185.0, 277.18, 369.99, 440.0],  // F# min (F#3, C#4, F#4, A4)
        [196.0, 246.94, 293.66, 392.0],  // G maj (G3, B3, D4, G4)
        [293.66, 369.99, 440.0, 587.33], // D maj (D4, F#4, A4, D5)
        [164.81, 246.94, 329.63, 392.0], // E min (E3, B3, E4, G4)
        [220.0, 277.18, 329.63, 440.0],  // A maj (A3, C#4, E4, A4)
      ],
      tempo: 450, // ms per arpeggio note
    },
    starlit: {
      // Soft dreamy pentatonic: C - G - Am - F
      chords: [
        [261.63, 329.63, 392.0, 523.25], // C
        [196.0, 246.94, 293.66, 392.0],  // G
        [220.0, 261.63, 329.63, 440.0],  // Am
        [174.61, 220.0, 261.63, 349.23], // F
      ],
      tempo: 550,
    },
    golden: {
      // Warm Rhodes sunset progression
      chords: [
        [220.0, 277.18, 329.63, 415.3],  // A6
        [207.65, 261.63, 311.13, 392.0], // G#m7
        [185.0, 220.0, 277.18, 329.63],  // F#m7
        [164.81, 220.0, 246.94, 329.63], // E sus
      ],
      tempo: 500,
    },
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.gainNode) return;

    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Warm acoustic envelope: quick gentle attack, mellow exponential decay
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio fallback handling
    }
  }

  public setTrack(track: string) {
    if (this.scales[track]) {
      this.currentTrack = track;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public start(onStep?: (noteIndex: number) => void) {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const track = this.scales[this.currentTrack] || this.scales.memories;
    let chordIndex = 0;
    let noteIndex = 0;

    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;

      const currentChord = track.chords[chordIndex];
      const freq = currentChord[noteIndex];

      // Primary warm sine wave + faint harmonic
      this.playTone(freq, 1.8, 'sine');
      this.playTone(freq * 2, 1.2, 'triangle');

      if (onStep) {
        onStep(noteIndex);
      }

      noteIndex++;
      if (noteIndex >= currentChord.length) {
        noteIndex = 0;
        chordIndex = (chordIndex + 1) % track.chords.length;
      }

      this.timerId = window.setTimeout(playNext, track.tempo);
    };

    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(onStep?: (noteIndex: number) => void): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(onStep);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getAnalyserData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    }
  }
}

export const ambientSynth = new AudioSynthesizer();
