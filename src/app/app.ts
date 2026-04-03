import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface WishMessage {
  text: string;
  ps: string;
  emoji: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private route = inject(ActivatedRoute);

  name = signal('Dear Friend');
  from = signal('');
  currentIndex = signal(0);
  animating = signal(false);
  copied = signal(false);
  musicPlaying = signal(false);
  showSparkles = signal(false);
  audio: HTMLAudioElement | null = null;

  readonly wishes: WishMessage[] = [
    {
      emoji: '🎂',
      text: `Happy Birthday, {name}! 🎂 Wishing you a day filled with small moments that make you smile, and a year that brings you closer to everything you love.`,
      ps: `P.S. Calories don't count today 😉`
    },
    {
      emoji: '🌼',
      text: `Wishing you a very Happy Birthday, {name}! 🌼 Another year, another reason to appreciate the wonderful person you are. Hope today feels a little extra special.`,
      ps: `P.S. You've officially earned an extra slice of cake 🍰`
    },
    {
      emoji: '🎉',
      text: `Happy Birthday, {name}! 🎉 May your day be calm, joyful, and filled with people who truly care about you.`,
      ps: `P.S. Today's agenda: smile, eat cake, repeat 🎂`
    },
    {
      emoji: '🍰',
      text: `Many happy returns of the day, {name}! 🍰 Wishing you a birthday that's as warm and wonderful as you are. And yes — cake is absolutely required today.`,
      ps: `P.S. No one's judging how many slices you have. Promise 😄`
    },
    {
      emoji: '😊',
      text: `Happy Birthday, {name}! 😊 You don't need a grand celebration — just good company, good hearts, and a really good slice of cake.`,
      ps: `P.S. The universe saved the best version of you for today 🌟`
    },
    {
      emoji: '✨',
      text: `Warmest birthday wishes, {name}! ✨ Another year of wisdom, grace, and all the little things that make you you. May it be your best one yet.`,
      ps: `P.S. Getting better with every year — that's your superpower 😊`
    },
    {
      emoji: '🌟',
      text: `Happy Birthday, {name}! 🌟 May this year bring you peace, good health, and a lot of little wins along the way. You truly deserve all of it.`,
      ps: `P.S. You deserve all the good things. Every single one 💛`
    },
    {
      emoji: '💛',
      text: `On your special day, {name}, I just want you to know how much your presence matters. You make the world a warmer, kinder place 💛 Happy Birthday!`,
      ps: `P.S. Treat yourself today — you've absolutely earned it 🌸`
    },
    {
      emoji: '🌸',
      text: `Happy Birthday, {name}! 🌸 Here's to another year of you being exactly who you are — thoughtful, resilient, and truly wonderful.`,
      ps: `P.S. May your Wi-Fi be strong and your cake be sweeter 🎂`
    }
  ];

  currentWish = computed(() => {
    const wish = this.wishes[this.currentIndex()];
    const nameStr = this.name();
    return {
      ...wish,
      text: wish.text.replace(/{name}/g, nameStr)
    };
  });

  sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: this.randomSparkleStyle()
  }));

  floatingEmojis = ['🎂', '🌼', '🎉', '🌸', '💛', '✨', '🍰', '⭐', '🎈', '🌟'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const rawName = params['name'] || '';
      if (rawName) {
        const cleaned = rawName
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
        this.name.set(cleaned);
      }

      const rawFrom = params['from'] || '';
      if (rawFrom) {
        const cleanedFrom = rawFrom
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
        this.from.set(cleanedFrom);
      }
    });

    this.currentIndex.set(Math.floor(Math.random() * this.wishes.length));
    this.triggerSparkles();
  }

  newWish() {
    if (this.animating()) return;
    this.animating.set(true);
    setTimeout(() => {
      let next = Math.floor(Math.random() * this.wishes.length);
      while (next === this.currentIndex() && this.wishes.length > 1) {
        next = Math.floor(Math.random() * this.wishes.length);
      }
      this.currentIndex.set(next);
      this.animating.set(false);
      this.triggerSparkles();
    }, 400);
  }

  async shareLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
  }

  toggleMusic() {
    if (!this.audio) {
      // Use a web audio API generated soft tone instead of an external file
      this.startGeneratedMusic();
    } else {
      if (this.musicPlaying()) {
        this.audio.pause();
        this.musicPlaying.set(false);
      } else {
        this.audio.play();
        this.musicPlaying.set(true);
      }
    }
  }

  private startGeneratedMusic() {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioCtx();
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      let time = ctx.currentTime;

      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.06, start + 0.05);
        gain.gain.linearRampToValueAtTime(0, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.1);
      };

      const melody = [0, 0, 2, 0, 5, 4, -1, 0, 0, 2, 0, 7, 5, -1, 0, 0, 12, 9, 5, 4, 2];
      const baseNote = 261.63;

      melody.forEach((interval, i) => {
        if (interval >= 0) {
          const freq = baseNote * Math.pow(2, interval / 12);
          playNote(freq, time, 0.4);
        }
        time += 0.5;
      });

      this.musicPlaying.set(true);
      setTimeout(() => {
        this.musicPlaying.set(false);
        this.audio = null;
      }, melody.length * 500);

      // Create a fake audio element so toggle works
      this.audio = new Audio();
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  private triggerSparkles() {
    this.showSparkles.set(true);
    setTimeout(() => this.showSparkles.set(false), 1500);
  }

  private randomSparkleStyle(): string {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const size = 6 + Math.random() * 10;
    return `top:${top}%;left:${left}%;animation-delay:${delay}s;font-size:${size}px`;
  }

  getFloatingStyle(i: number): string {
    const duration = 18 + (i * 3.7) % 12;
    const delay = -(i * 2.3) % duration;
    const left = (i * 9.7 + 5) % 95;
    const size = 16 + (i * 7) % 20;
    return `left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s;font-size:${size}px`;
  }
}
