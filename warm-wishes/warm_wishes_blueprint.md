# Warm Wishes 🎂 — Project Blueprint & Recreation Prompt

> A heartfelt, personalized birthday greeting single-page Angular application.
> This document is a complete blueprint to recreate the app from scratch.

---

## 🔁 Self-Contained Recreation Prompt

> Copy everything from PROMPT START to PROMPT END and hand it to any AI assistant to recreate this app.

---

### PROMPT START

Build a single-page Angular 21 application called **"Warm Wishes 🎂"** — a heartfelt, personalized birthday greeting experience.

---

## 📦 Project Setup

Scaffold an Angular 21 standalone project:

```bash
npx -y @angular/cli@^21 new warm-wishes --standalone --routing --style=css --skip-git --skip-tests
```

Install no extra dependencies — use only Angular built-ins and browser Web APIs.

---

## 🗂 File Structure

```
src/
├── index.html
├── main.ts              (untouched — bootstraps AppConfig)
├── styles.css           (global styles + animated background)
└── app/
    ├── app.config.ts    (provideRouter with withComponentInputBinding)
    ├── app.routes.ts    (empty routes array)
    ├── app.ts           (main standalone component — all logic here)
    ├── app.html         (template)
    └── app.css          (component styles)
```

---

## 🎯 Core Functionality

- Read `name` from URL query param: `/?name=Vikas-sir`
- Hyphen-separated names are converted and title-cased: `Vikas-sir` → `Vikas Sir`
- Default to `"Dear Friend"` when no name param is present
- Randomly pick one of 9 wish messages on load
- **✨ New Wish** button — smoothly rotates to a different message (never repeats consecutively) with a sparkle burst animation
- **📤 Share** button — copies current page URL to clipboard; shows `"Copied!"` for 2.5 seconds
- **🎵 Music** button — plays a soft "Happy Birthday" melody using the Web Audio API (no audio file needed); toggles to mute

---

## 📄 src/index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Warm Wishes 🎂 — Personalized Birthday Greetings</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Send a heartfelt, personalized birthday greeting to someone special. Warm, playful, and shareable.">
  <meta property="og:title" content="Warm Wishes 🎂">
  <meta property="og:description" content="A heartfelt birthday greeting made just for you 💛">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

## 📄 src/styles.css

Global reset + animated pastel gradient background (peach to salmon to lavender to sky to rose, cycling every 15s at 400% size):

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Lato', system-ui, sans-serif;
}

html, body {
  height: 100%;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg,
    #ffecd2 0%,
    #fcb69f 15%,
    #ffecd2 30%,
    #e8d5f5 50%,
    #d4e8f5 70%,
    #fce4ec 85%,
    #ffecd2 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 📄 src/app/app.config.ts

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding())
  ]
};
```

---

## 📄 src/app/app.routes.ts

```typescript
import { Routes } from '@angular/router';
export const routes: Routes = [];
```

---

## 📄 src/app/app.ts — Full Component

```typescript
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
  currentIndex = signal(0);
  animating = signal(false);
  copied = signal(false);
  musicPlaying = signal(false);
  showSparkles = signal(false);
  audio: HTMLAudioElement | null = null;

  readonly wishes: WishMessage[] = [
    {
      emoji: '🎂',
      text: 'Happy Birthday, {name}! 🎂 Wishing you a day filled with small moments that make you smile, and a year that brings you closer to everything you love.',
      ps: "P.S. Calories don't count today 😉"
    },
    {
      emoji: '🌼',
      text: 'Wishing you a very Happy Birthday, {name}! 🌼 Another year, another reason to appreciate the wonderful person you are. Hope today feels a little extra special.',
      ps: "P.S. You've officially earned an extra slice of cake 🍰"
    },
    {
      emoji: '🎉',
      text: 'Happy Birthday, {name}! 🎉 May your day be calm, joyful, and filled with people who truly care about you.',
      ps: 'P.S. Today\'s agenda: smile, eat cake, repeat 🎂'
    },
    {
      emoji: '🍰',
      text: "Many happy returns of the day, {name}! 🍰 Wishing you a birthday that's as warm and wonderful as you are. And yes — cake is absolutely required today.",
      ps: "P.S. No one's judging how many slices you have. Promise 😄"
    },
    {
      emoji: '😊',
      text: "Happy Birthday, {name}! 😊 You don't need a grand celebration — just good company, good hearts, and a really good slice of cake.",
      ps: 'P.S. The universe saved the best version of you for today 🌟'
    },
    {
      emoji: '✨',
      text: 'Warmest birthday wishes, {name}! ✨ Another year of wisdom, grace, and all the little things that make you you. May it be your best one yet.',
      ps: "P.S. Getting better with every year — that's your superpower 😊"
    },
    {
      emoji: '🌟',
      text: 'Happy Birthday, {name}! 🌟 May this year bring you peace, good health, and a lot of little wins along the way. You truly deserve all of it.',
      ps: 'P.S. You deserve all the good things. Every single one 💛'
    },
    {
      emoji: '💛',
      text: 'On your special day, {name}, I just want you to know how much your presence matters. You make the world a warmer, kinder place 💛 Happy Birthday!',
      ps: "P.S. Treat yourself today — you've absolutely earned it 🌸"
    },
    {
      emoji: '🌸',
      text: "Happy Birthday, {name}! 🌸 Here's to another year of you being exactly who you are — thoughtful, resilient, and truly wonderful.",
      ps: 'P.S. May your Wi-Fi be strong and your cake be sweeter 🎂'
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

      // Happy Birthday melody — semitone intervals from C4 (-1 = rest)
      const melody = [0, 0, 2, 0, 5, 4, -1, 0, 0, 2, 0, 7, 5, -1, 0, 0, 12, 9, 5, 4, 2];
      const baseNote = 261.63; // C4

      melody.forEach((interval) => {
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

      this.audio = new Audio(); // placeholder so toggle state tracks correctly
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
```

---

## 📄 src/app/app.html — Template

```html
<div class="page-wrapper">

  <!-- Floating background emojis -->
  <div class="floating-bg" aria-hidden="true">
    @for (emoji of floatingEmojis; track $index) {
      <span class="float-emoji" [style]="getFloatingStyle($index)">{{ emoji }}</span>
    }
  </div>

  <!-- Sparkles overlay shown on each new wish -->
  @if (showSparkles()) {
    <div class="sparkles-overlay" aria-hidden="true">
      @for (s of sparkles; track s.id) {
        <span class="sparkle" [style]="s.style">✨</span>
      }
    </div>
  }

  <main class="wish-container">
    <div class="wish-card" [class.animating]="animating()">

      <!-- Bouncing emoji above card -->
      <div class="emoji-badge" aria-hidden="true">
        {{ currentWish().emoji }}
      </div>

      <header class="card-header">
        <p class="app-eyebrow">✦ A Birthday Celebration ✦</p>
        <h1 class="app-title">Warm Wishes</h1>
      </header>

      <!-- Name section with ornamental lines -->
      <div class="name-display">
        <div class="name-ornament">
          <span class="ornament-line"></span>
          <span class="ornament-icon">❧</span>
          <span class="ornament-line"></span>
        </div>
        <p class="recipient-name">{{ name() }}</p>
        <div class="name-ornament name-ornament--bottom">
          <span class="ornament-line"></span>
          <span class="ornament-icon">❧</span>
          <span class="ornament-line"></span>
        </div>
      </div>

      <div class="message-block">
        <p class="wish-text">{{ currentWish().text }}</p>
        <p class="ps-text">{{ currentWish().ps }}</p>
      </div>

      <div class="card-divider" aria-hidden="true">
        <span class="divider-line"></span>
        <span class="divider-dot">◆</span>
        <span class="divider-line"></span>
      </div>

      <div class="actions">
        <button id="new-wish-btn" class="btn btn-primary"
          (click)="newWish()" [disabled]="animating()" title="Show another birthday wish">
          <span class="btn-icon">✨</span>
          <span>New Wish</span>
        </button>

        <button id="share-btn" class="btn btn-secondary"
          (click)="shareLink()" title="Copy shareable link">
          <span class="btn-icon">{{ copied() ? '✅' : '📤' }}</span>
          <span>{{ copied() ? 'Copied!' : 'Share' }}</span>
        </button>

        <button id="music-btn" class="btn btn-ghost"
          (click)="toggleMusic()" [class.active]="musicPlaying()" title="Toggle background music">
          <span class="btn-icon">{{ musicPlaying() ? '🔇' : '🎵' }}</span>
          <span>{{ musicPlaying() ? 'Mute' : 'Music' }}</span>
        </button>
      </div>

      <p class="footer-hint">
        Personalize by adding <strong>?name=YourFriendName</strong> to the link 🎁
      </p>
    </div>
  </main>

  <router-outlet />
</div>
```

---

## 📄 src/app/app.css — Component Styles

```css
.page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  position: relative;
  overflow: hidden;
}

.floating-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.float-emoji {
  position: absolute;
  bottom: -60px;
  opacity: 0.12;
  animation: floatUp linear infinite;
  user-select: none;
  filter: blur(1px);
}

@keyframes floatUp {
  0%   { transform: translateY(0) rotate(0deg);       opacity: 0; }
  8%   { opacity: 0.12; }
  92%  { opacity: 0.08; }
  100% { transform: translateY(-115vh) rotate(360deg); opacity: 0; }
}

.sparkles-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.sparkle {
  position: absolute;
  animation: sparkleAnim 1.4s ease-out forwards;
  opacity: 0;
}

@keyframes sparkleAnim {
  0%   { opacity: 0; transform: scale(0.4) translateY(0); }
  25%  { opacity: 1; transform: scale(1.4) translateY(-10px); }
  70%  { opacity: 0.5; transform: scale(1.1) translateY(-20px); }
  100% { opacity: 0; transform: scale(0.7) translateY(-36px); }
}

.wish-container {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 600px;
}

.wish-card {
  background: rgba(255, 253, 248, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 32px;
  padding: 56px 52px 40px;
  box-shadow:
    0 2px 0 rgba(255,255,255,0.95) inset,
    0 -1px 0 rgba(210,180,160,0.15) inset,
    0 24px 72px rgba(140, 80, 80, 0.13),
    0 6px 28px rgba(140, 80, 80, 0.08);
  border: 1px solid rgba(255, 235, 210, 0.7);
  text-align: center;
  transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, opacity 0.4s ease;
  position: relative;
}

.wish-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 2px 0 rgba(255,255,255,0.95) inset,
    0 36px 90px rgba(140, 80, 80, 0.17),
    0 10px 36px rgba(140, 80, 80, 0.11);
}

.wish-card.animating {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.emoji-badge {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 58px;
  line-height: 1;
  filter: drop-shadow(0 6px 16px rgba(180, 100, 80, 0.28));
  animation: badgeBounce 3.5s ease-in-out infinite;
}

@keyframes badgeBounce {
  0%, 100% { transform: translateX(-50%) translateY(0) rotate(-2deg); }
  50%       { transform: translateX(-50%) translateY(-8px) rotate(2deg); }
}

.card-header {
  margin-top: 24px;
  margin-bottom: 28px;
}

.app-eyebrow {
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: #c9a07a;
  margin-bottom: 8px;
}

.app-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.15;
  background: linear-gradient(145deg, #b5451b 0%, #8e3a8e 45%, #2960a8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.name-display {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.name-ornament {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 380px;
}

.ornament-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4a878, transparent);
}

.name-ornament--bottom .ornament-line {
  background: linear-gradient(90deg, transparent, #c9a0c9, transparent);
}

.ornament-icon {
  font-size: 16px;
  color: #c9a07a;
  line-height: 1;
  flex-shrink: 0;
}

.name-ornament--bottom .ornament-icon {
  color: #c9a0c9;
  transform: rotate(180deg);
  display: inline-block;
}

.recipient-name {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.2;
  background: linear-gradient(135deg, #8b4513, #6b3080, #1a5a8a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 4px 0;
}

.message-block {
  margin-bottom: 28px;
}

.wish-text {
  font-family: 'Lato', sans-serif;
  font-size: 1.08rem;
  line-height: 1.85;
  color: #4a3535;
  font-weight: 400;
  letter-spacing: 0.15px;
  margin-bottom: 20px;
}

.ps-text {
  font-family: 'Lato', sans-serif;
  font-size: 0.88rem;
  color: #9a7050;
  font-style: italic;
  font-weight: 300;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(255,220,180,0.18), rgba(255,200,200,0.12));
  border-radius: 14px;
  border: 1px solid rgba(210, 170, 120, 0.22);
  text-align: left;
  position: relative;
}

.ps-text::before {
  content: '"';
  position: absolute;
  left: 8px;
  top: -2px;
  font-size: 2rem;
  color: rgba(200, 160, 100, 0.35);
  font-family: 'Playfair Display', serif;
  line-height: 1;
}

.card-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 28px 0 24px;
}

.divider-line {
  flex: 1;
  max-width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180, 140, 100, 0.35), transparent);
}

.divider-dot {
  font-size: 10px;
  color: #c9a07a;
  opacity: 0.7;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: 50px;
  border: none;
  font-family: 'Lato', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s ease, background 0.25s ease, opacity 0.2s ease;
}

.btn:hover:not(:disabled) { transform: translateY(-3px); }
.btn:active:not(:disabled) { transform: translateY(-1px); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-icon { font-size: 1rem; text-transform: none; }

.btn-primary {
  background: linear-gradient(135deg, #e91e8c, #f5576c);
  color: white;
  box-shadow: 0 6px 22px rgba(229, 30, 100, 0.36), 0 1px 0 rgba(255,255,255,0.2) inset;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #d81b7e, #e84b5f);
  box-shadow: 0 12px 32px rgba(229, 30, 100, 0.45), 0 1px 0 rgba(255,255,255,0.2) inset;
}

.btn-secondary {
  background: linear-gradient(135deg, #5c6bc0, #7e57c2);
  color: white;
  box-shadow: 0 6px 22px rgba(94, 107, 192, 0.38), 0 1px 0 rgba(255,255,255,0.18) inset;
}
.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f5db0, #7048b8);
  box-shadow: 0 12px 32px rgba(94, 107, 192, 0.48);
}

.btn-ghost {
  background: rgba(255, 248, 240, 0.85);
  color: #7a5840;
  border: 1.5px solid rgba(200, 160, 110, 0.35);
  box-shadow: 0 4px 16px rgba(160, 110, 70, 0.1);
}
.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 235, 210, 0.95);
  border-color: rgba(200, 150, 90, 0.55);
}
.btn-ghost.active {
  background: linear-gradient(135deg, #fff0dc, #ffe4f0);
  border-color: rgba(200, 120, 100, 0.4);
  color: #b05830;
}

.footer-hint {
  font-size: 0.74rem;
  color: #b8a090;
  line-height: 1.6;
  padding: 0 12px;
  font-weight: 300;
  letter-spacing: 0.2px;
}

.footer-hint strong {
  font-weight: 600;
  color: #9a7870;
  background: rgba(220, 180, 150, 0.18);
  padding: 1px 6px;
  border-radius: 4px;
  font-style: italic;
}

@media (max-width: 520px) {
  .wish-card { padding: 48px 26px 32px; border-radius: 24px; }
  .app-title { font-size: 1.9rem; }
  .recipient-name { font-size: 1.6rem; }
  .wish-text { font-size: 1rem; }
  .actions { gap: 8px; }
  .btn { padding: 11px 18px; font-size: 0.82rem; }
  .emoji-badge { font-size: 46px; top: -26px; }
  .name-ornament { max-width: 280px; }
}
```

---

## 🎨 Design Decisions

| Decision | Rationale |
|---|---|
| **Playfair Display** for title & name | Serif elegance — dignified for elders, romantic for young |
| **Lato** for body text | Clean readability across all ages and screens |
| **Ornamental ❧ hairlines** flanking the name | Replaces clunky label — feels like fine stationery |
| **Animated gradient body** (peach → lavender → sky, 400% / 15s) | Lively and warm without being distracting |
| **Glassmorphism card** (blur + frosted cream bg) | Premium feel, contrasts beautifully against animated background |
| **Gradient text** for title and name | Adds richness without images or assets |
| **Uppercase letter-spaced buttons** | Refined, editorial — suits elders and young professionals alike |
| **No "Hey" or blunt name-first openers** | All messages begin with a proper, humble greeting |

---

## 💡 Message Writing Rules

All 9 messages must follow these rules:

1. **Always open with a proper greeting:**
   - `Happy Birthday, {name}!`
   - `Wishing you a very Happy Birthday, {name}!`
   - `Many happy returns of the day, {name}!`
   - `Warmest birthday wishes, {name}!`
   - `On your special day, {name},`
2. **Never start with "Hey"** — too casual, not humble enough for elders
3. **Never start with bare `{name},`** — feels abrupt and impersonal
4. **Tone**: warm, heartfelt, lightly playful — never loud, dramatic, or over-the-top
5. **P.S. lines**: gentle humour around cake, calories, life — keeps it human
6. Each message has a **unique emoji** that appears as the bouncing badge above the card

---

## 🚀 Run Instructions

```bash
npm install
npm start
# App runs at http://localhost:4200/
```

**Usage examples:**
- `http://localhost:4200/?name=Vikas-sir` → greeting for "Vikas Sir"
- `http://localhost:4200/?name=Priya` → greeting for "Priya"
- `http://localhost:4200/` → falls back to "Dear Friend"

### PROMPT END
