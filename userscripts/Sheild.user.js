// ==UserScript==
// @name         Focus Shield
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Minimal website blocker with productivity redirects
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    
    // Sites to block (add/remove as needed)
    const BLOCKED_SITES = [
        'facebook.com',
        'twitter.com',
        'x.com',
        'instagram.com',
        'reddit.com',
        'youtube.com',
        'tiktok.com',
        'netflix.com'
    ];

    // Better alternatives to suggest (add/remove as needed)
    const SUGGESTIONS = [
        { name: 'Shikho', url: 'https://shikho.com', icon: '📚', desc: 'Learn something new' },
        { name: 'Khan Academy', url: 'https://www.khanacademy.org', icon: '🎓', desc: 'Free education' },
        { name: 'Coursera', url: 'https://www.coursera.org', icon: '🎯', desc: 'Online courses' },
        { name: 'Medium', url: 'https://medium.com', icon: '📝', desc: 'Read quality articles' },
        { name: 'Brilliant', url: 'https://brilliant.org', icon: '💡', desc: 'Math & science' }
    ];

    // ============ CORE LOGIC ============
    
    const currentDomain = window.location.hostname.replace('www.', '');
    const isBlocked = BLOCKED_SITES.some(site => currentDomain.includes(site));

    if (!isBlocked) return;

    // Stop page from loading
    document.addEventListener('DOMContentLoaded', (e) => e.stopImmediatePropagation(), true);
    window.stop();

    // ============ OVERLAY UI ============
    
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Crimson+Pro:wght@300;400;600&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                overflow: hidden;
            }

            .focus-overlay {
                position: fixed;
                inset: 0;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                z-index: 999999;
                font-family: 'Crimson Pro', serif;
                color: #e8e8e8;
                overflow-y: auto;
                animation: fadeIn 0.4s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .focus-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 4rem 2rem;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .focus-header {
                text-align: center;
                margin-bottom: 4rem;
                animation: slideDown 0.6s ease-out 0.2s both;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .focus-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                display: inline-block;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .focus-title {
                font-size: 3rem;
                font-weight: 600;
                margin-bottom: 1rem;
                letter-spacing: -0.02em;
                background: linear-gradient(135deg, #fff 0%, #a8a8a8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .focus-subtitle {
                font-size: 1.25rem;
                color: #888;
                font-weight: 300;
                font-family: 'Space Mono', monospace;
                letter-spacing: 0.05em;
            }

            .blocked-site {
                background: rgba(255, 59, 48, 0.1);
                border: 1px solid rgba(255, 59, 48, 0.3);
                padding: 1rem 1.5rem;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 3rem;
                font-family: 'Space Mono', monospace;
                font-size: 0.9rem;
                color: #ff6b6b;
                animation: slideUp 0.6s ease-out 0.4s both;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 3rem;
            }

            .option-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 2rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                animation: fadeInUp 0.6s ease-out both;
            }

            .option-card:nth-child(1) { animation-delay: 0.5s; }
            .option-card:nth-child(2) { animation-delay: 0.6s; }
            .option-card:nth-child(3) { animation-delay: 0.7s; }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .option-card::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
                opacity: 0;
                transition: opacity 0.3s;
            }

            .option-card:hover {
                transform: translateY(-4px);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .option-card:hover::before {
                opacity: 1;
            }

            .option-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                display: block;
            }

            .option-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .option-desc {
                font-size: 0.95rem;
                color: #999;
                font-family: 'Space Mono', monospace;
            }

            .suggestions-section {
                animation: fadeInUp 0.6s ease-out 0.8s both;
            }

            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                text-align: center;
                color: #aaa;
                font-family: 'Space Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                font-size: 0.85rem;
            }

            .suggestions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
            }

            .suggestion-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: inherit;
                display: block;
            }

            .suggestion-card:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .suggestion-icon {
                font-size: 2rem;
                margin-bottom: 0.75rem;
                display: block;
            }

            .suggestion-name {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }

            .suggestion-desc {
                font-size: 0.85rem;
                color: #777;
                font-family: 'Space Mono', monospace;
            }

            .pomodoro {
                display: none;
                text-align: center;
                animation: fadeIn 0.4s ease-out;
            }

            .pomodoro.active {
                display: block;
            }

            .timer-display {
                font-size: 6rem;
                font-weight: 700;
                font-family: 'Space Mono', monospace;
                margin: 2rem 0;
                letter-spacing: 0.1em;
                background: linear-gradient(135deg, #fff 0%, #888 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .timer-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }

            .btn {
                padding: 1rem 2.5rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                border-radius: 12px;
                font-size: 1rem;
                font-family: 'Space Mono', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-weight: 600;
            }

            .btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.4);
                transform: translateY(-2px);
            }

            .btn-primary {
                background: rgba(255, 255, 255, 0.9);
                color: #0a0a0a;
                border-color: transparent;
            }

            .btn-primary:hover {
                background: #fff;
            }

            .back-btn {
                margin-top: 2rem;
            }

            .timer-phase {
                font-size: 1rem;
                color: #888;
                font-family: 'Space Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-bottom: 1rem;
            }

            @media (max-width: 768px) {
                .focus-title {
                    font-size: 2rem;
                }
                
                .timer-display {
                    font-size: 4rem;
                }
                
                .options-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <div class="focus-overlay">
            <div class="focus-container">
                <div id="mainView">
                    <div class="focus-header">
                        <div class="focus-icon">🛡️</div>
                        <h1 class="focus-title">Focus Shield</h1>
                        <p class="focus-subtitle">Stay on track</p>
                    </div>

                    <div class="blocked-site">
                        <strong>${currentDomain}</strong> is blocked
                    </div>

                    <div class="options-grid">
                        <div class="option-card" onclick="window.focusShield.showPomodoro()">
                            <span class="option-icon">⏱️</span>
                            <h3 class="option-title">Pomodoro</h3>
                            <p class="option-desc">25 min focus timer</p>
                        </div>

                        <div class="option-card" onclick="window.close()">
                            <span class="option-icon">🚪</span>
                            <h3 class="option-title">Close Tab</h3>
                            <p class="option-desc">Remove distraction</p>
                        </div>

                        <div class="option-card" onclick="window.history.back()">
                            <span class="option-icon">↩️</span>
                            <h3 class="option-title">Go Back</h3>
                            <p class="option-desc">Return to previous page</p>
                        </div>
                    </div>

                    <div class="suggestions-section">
                        <h2 class="section-title">Better Alternatives</h2>
                        <div class="suggestions-grid">
                            ${SUGGESTIONS.map(site => `
                                <a href="${site.url}" class="suggestion-card">
                                    <span class="suggestion-icon">${site.icon}</span>
                                    <div class="suggestion-name">${site.name}</div>
                                    <div class="suggestion-desc">${site.desc}</div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div id="pomodoroView" class="pomodoro">
                    <div class="focus-header">
                        <div class="focus-icon">🍅</div>
                        <h1 class="focus-title">Pomodoro Timer</h1>
                    </div>
                    
                    <div class="timer-phase" id="timerPhase">Focus Time</div>
                    <div class="timer-display" id="timerDisplay">25:00</div>
                    
                    <div class="timer-controls">
                        <button class="btn btn-primary" id="startBtn">Start</button>
                        <button class="btn" id="resetBtn">Reset</button>
                    </div>
                    
                    <button class="btn back-btn" onclick="window.focusShield.showMain()">← Back</button>
                </div>
            </div>
        </div>
    `;

    // ============ POMODORO LOGIC ============
    
    window.focusShield = {
        timer: null,
        timeLeft: 25 * 60,
        isRunning: false,
        isBreak: false,

        showPomodoro() {
            document.getElementById('mainView').style.display = 'none';
            document.getElementById('pomodoroView').classList.add('active');
        },

        showMain() {
            document.getElementById('mainView').style.display = 'block';
            document.getElementById('pomodoroView').classList.remove('active');
            this.reset();
        },

        updateDisplay() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            document.getElementById('timerDisplay').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        },

        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            document.getElementById('startBtn').textContent = 'Pause';
            
            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.updateDisplay();
                } else {
                    this.complete();
                }
            }, 1000);
        },

        pause() {
            this.isRunning = false;
            document.getElementById('startBtn').textContent = 'Start';
            clearInterval(this.timer);
        },

        reset() {
            this.pause();
            this.timeLeft = this.isBreak ? 5 * 60 : 25 * 60;
            this.updateDisplay();
        },

        complete() {
            this.pause();
            
            if (!this.isBreak) {
                // Work session complete, start break
                this.isBreak = true;
                this.timeLeft = 5 * 60;
                document.getElementById('timerPhase').textContent = 'Break Time';
                alert('🎉 Great work! Time for a 5-minute break.');
            } else {
                // Break complete, start work
                this.isBreak = false;
                this.timeLeft = 25 * 60;
                document.getElementById('timerPhase').textContent = 'Focus Time';
                alert('✨ Break over! Ready for another focus session?');
            }
            
            this.updateDisplay();
        }
    };

    // ============ INITIALIZATION ============
    
    document.documentElement.innerHTML = '';
    document.documentElement.appendChild(overlay);

    // Event listeners
    document.getElementById('startBtn').addEventListener('click', function() {
        if (window.focusShield.isRunning) {
            window.focusShield.pause();
        } else {
            window.focusShield.start();
        }
    });

    document.getElementById('resetBtn').addEventListener('click', function() {
        window.focusShield.reset();
    });

})();
