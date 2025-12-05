// =========================
// SUKOON — CLEAN & OPTIMIZED APP.JS
// =========================

class WellnessPortal {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.isLoggedIn = false;
        this.chatMessages = [];
        this.forumPosts = [];
        this.selectedTimeSlot = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();

        setTimeout(() => {
            this.setupCharts();
            this.animateCounters();
        }, 150);
    }

    // =========================
    // NAVIGATION (CLEAN & FIXED)
    // =========================
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Page navigation
            if (e.target.hasAttribute('data-page')) {
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
                return;
            }
            if (e.target.closest('[data-page]')) {
                const p = e.target.closest('[data-page]');
                this.navigateToPage(p.getAttribute('data-page'));
                return;
            }

            // Mobile menu
            if (e.target.id === 'nav-toggle' || e.target.closest('#nav-toggle')) {
                this.toggleMobileMenu();
                return;
            }

            // Select time slot
            if (e.target.classList.contains('time-slot')) {
                this.selectTimeSlot(e.target);
                return;
            }

            // Forum actions
            if (e.target.classList.contains('post-action-btn')) {
                this.handlePostAction(e.target);
                return;
            }

            // Mood selection handled in separate module (cleaned)
        });

        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) bookingForm.addEventListener('submit', (e) => this.handleBooking(e));

        const postBtn = document.getElementById('submit-post');
        if (postBtn) postBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitForumPost();
        });

        const resourceSearch = document.getElementById('resource-search');
        const categoryFilter = document.getElementById('category-filter');

        if (resourceSearch) resourceSearch.addEventListener('input', () => this.filterResources());
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterResources());

        // Date selector
        const appointmentDate = document.getElementById('appointment-date');
        if (appointmentDate) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            appointmentDate.min = tomorrow.toISOString().split('T')[0];

            const maxDate = new Date(now);
            maxDate.setDate(now.getDate() + 30);
            appointmentDate.max = maxDate.toISOString().split('T')[0];
        }
    }

    navigateToPage(page) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('active'));

        const target = document.getElementById(page);
        if (target) {
            target.classList.add('active');

            document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
            document.querySelectorAll(`[data-page="${page}"]`).forEach(a => a.classList.add('active'));

            this.currentPage = page;
            this.initializePage(page);

            window.scrollTo(0, 0);
        }

        this.closeMobileMenu();
    }

    initializePage(page) {
        switch (page) {
            case 'chatbot':
                this.initializeChatbot();
                break;
            case 'dashboard':
                this.initializeUserDashboard();
                break;
            case 'resources':
                this.initializeResources();
                break;
            case 'admin':
                setTimeout(() => this.initializeAdminDashboard(), 100);
                break;
        }
    }

    // =========================
    // LOGIN
    // =========================
    handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const anonymousMode = document.getElementById('anonymous-mode').checked;

        if (email && password) {
            this.isLoggedIn = true;
            this.currentUser = {
                email,
                name: anonymousMode ? "User" : email.split("@")[0],
            };

            this.showSuccessMessage("Login successful! Welcome ❤️");

            setTimeout(() => {
                this.navigateToPage("dashboard");
                this.updateUserName();
            }, 1500);
        }
    }

    updateUserName() {
        document.querySelectorAll('#user-name').forEach(e => {
            if (this.currentUser) e.textContent = this.currentUser.name;
        });
    }

    // =========================
    // BOOKINGS
    // =========================
    selectTimeSlot(slot) {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        this.selectedTimeSlot = slot.getAttribute('data-time');
    }

    handleBooking(e) {
        e.preventDefault();

        const counselor = document.getElementById('counselor-select').value;
        const date = document.getElementById('appointment-date').value;

        if (counselor && date && this.selectedTimeSlot) {
            const ticket = "#A" + Math.random().toString(36).substr(2, 5).toUpperCase();
            this.showSuccessMessage(`Appointment booked! Ticket ID: ${ticket}`);

            document.getElementById('booking-form').reset();
            this.selectedTimeSlot = null;
        } else {
            alert("Please fill everything.");
        }
    }

    // =========================
    // CHATBOT
    // =========================
    initializeChatbot() {
        const chatArea = document.getElementById('chat-area');
        if (!chatArea) return;

        const welcome = chatArea.querySelector('.bot-message');
        if (!welcome) {
            setTimeout(() => {
                this.addBotMessage("Hello! How can I support you today?");
            }, 400);
        }

        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        if (chatInput && sendBtn) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
            sendBtn.addEventListener('click', () => this.sendChatMessage());
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.addtext(text);
        input.value = "";

        this.addTypingIndicator();
        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateBotResponse(text);
        }, 1000);
    }

    addtext(msg) {
        const area = document.getElementById('chat-area');
        const div = document.createElement('div');
        div.className = "message user-message";
        div.innerHTML = `
            <div class="message-bubble"><p>${msg}</p></div>
            <div class="message-avatar">👤</div>
        `;
        area.appendChild(div);
        area.scrollTop = area.scrollHeight;
    }

    addBotMessage(msg) {
        const area = document.getElementById('chat-area');
        const div = document.createElement('div');
        div.className = "message bot-message";
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble"><p>${msg}</p></div>
        `;
        area.appendChild(div);
        area.scrollTop = area.scrollHeight;
    }

    addTypingIndicator() {
        const area = document.getElementById('chat-area');
        const t = document.createElement('div');
        t.className = "message bot-message typing-message";
        t.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        area.appendChild(t);
        area.scrollTop = area.scrollHeight;
    }

    removeTypingIndicator() {
        const t = document.querySelector(".typing-message");
        if (t) t.remove();
    }

    generateBotResponse(text) {
    // larger response pool + context matching
    const coreReplies = [
        "I hear you. Thanks for sharing — would you like a quick breathing exercise or some study tips?",
        "That's tough. Small steps help — want a 2-minute breathing guide or a short grounding exercise?",
        "You're not alone. Want some quick self-care ideas you can do in 5 minutes?",
        "If this feels overwhelming, try naming what you're feeling (e.g., stressed, tired). It helps make the feeling smaller.",
        "Short breaks help. Try Pomodoro: 25 minutes study, 5 minutes break — and use the timer here.",
        "Sleep affects mood a lot. Want a few practical sleep-hygiene tips?",
        "Feeling low? Could be useful to message one friend — a short 'how are you?' can be enough.",
        "If thoughts feel unsafe or like self-harm, please contact local emergency services or the crisis helpline immediately."
    ];

    const lower = text.toLowerCase();

    // priority keyword patterns
    if (/\b(stress|stressed|anxious|anxiety)\b/.test(lower)) {
        this.addBotMessage("I can see you're stressed. Would you like a 2-minute breathing exercise (I can show steps) or tips to calm down right now?");
        return;
    }

    if (/\b(exam|tests|study|exam stress|prepare)\b/.test(lower)) {
        this.addBotMessage("Exams can be heavy. Try focused sessions with short breaks. Want a study-break meditation or a simple schedule template?");
        return;
    }

    if (/\b(sleep|tired|insomnia|can't sleep)\b/.test(lower)) {
        this.addBotMessage("Sleep troubles are common. Do you want quick sleep-hygiene tips or a relaxing 10-min routine?");
        return;
    }

    if (/\b(lonely|alone|friendless|isolated)\b/.test(lower)) {
        this.addBotMessage("I'm sorry you're feeling lonely. Would you like some steps to connect with others or ideas for low-effort social activities?");
        return;
    }

    if (/\b(how are you|hello|hi|hey)\b/.test(lower)) {
        this.addBotMessage("Hey! I'm here to support you. How are you feeling right now?");
        return;
    }

    if (/\b(suicid|hurt myself|kill myself|want to die)\b/.test(lower)) {
        // sensitive — give crisis info and escalate
        this.addBotMessage("I’m really sorry you're feeling so bad. If you're thinking of harming yourself, please contact local emergency services or a crisis line right now. If you're in India, consider contacting local emergency services or your campus counselor. Would you like crisis helpline numbers?");
        return;
    }

    // otherwise, fallback: mix empathy + suggestion
    // choose a semi-random reply from coreReplies
    const reply = coreReplies[Math.floor(Math.random() * coreReplies.length)];
    this.addBotMessage(reply);
}


    // =========================
    // FORUM SYSTEM
    // =========================
    submitForumPost() {
        const t = document.getElementById('new-post-content').value.trim();
        if (!t) return alert("Write something!");

        this.addForumPost(t);
        document.getElementById('new-post-content').value = "";
    }

    addForumPost(msg) {
        const container = document.getElementById('forum-posts');
        const div = document.createElement('div');
        const user = "User" + Math.floor(Math.random() * 999);

        div.className = "forum-post card-3d";
        div.innerHTML = `
            <div class="post-header">
                <span class="post-author">${user}</span>
                <span class="post-time">Just now</span>
            </div>
            <div class="post-content"><p>${msg}</p></div>
            <div class="post-actions">
                <button class="post-action-btn upvote">👍 <span>0</span></button>
                <button class="post-action-btn comment">💬 Comment</button>
                <button class="post-action-btn report">⚠️ Report</button>
            </div>
        `;
        container.prepend(div);
    }

    handlePostAction(btn) {
        if (btn.classList.contains('upvote')) {
            const span = btn.querySelector('span');
            span.textContent = Number(span.textContent) + 1;
            btn.style.color = "#a8e6cf";
        } else if (btn.classList.contains('comment')) {
            alert("Comments coming soon!");
        } else if (btn.classList.contains('report')) {
            if (confirm("Report this post?")) alert("Reported.");
        }
    }

    // =========================
// RESOURCES (search/filter + modal + media + AI hint)
// =========================
filterResources() {
    const q = document.getElementById('resource-search')?.value.trim().toLowerCase() || "";
    const cat = document.getElementById('category-filter')?.value || "";

    // smarter matching: match words, not only substring
    const tokens = q.split(/\s+/).filter(Boolean);

    document.querySelectorAll('.resource-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || "";
        const desc = card.querySelector('p')?.textContent.toLowerCase() || "";
        const c = card.getAttribute("data-category") || "";

        // if no query, matches by category only
        let matchesQuery = tokens.length === 0 ? true : tokens.every(t => (title.includes(t) || desc.includes(t)));

        const matchesCategory = !cat || cat === c;

        const show = matchesQuery && matchesCategory;
        card.style.display = show ? "block" : "none";
        // accessible attribute for screen-readers
        card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });

    // if no results, show a small helper message (create if not exists)
    let grid = document.getElementById('resources-grid');
    if (grid) {
        let helper = document.getElementById('resources-empty-msg');
        const anyVisible = Array.from(grid.querySelectorAll('.resource-card')).some(r => r.style.display !== 'none');
        if (!anyVisible) {
            if (!helper) {
                helper = document.createElement('div');
                helper.id = 'resources-empty-msg';
                helper.className = 'muted';
                helper.style.margin = '12px 0';
                grid.parentNode.insertBefore(helper, grid.nextSibling);
            }
            helper.textContent = 'Koi resource nahi mila — try different keywords or category.';
        } else {
            if (helper) helper.remove();
        }
    }
}

initializeResources() {
    // run initial filter
    this.filterResources();

    // wire resource buttons (delegated)
    this.bindResourceButtons();

    // animate resource cards
    document.querySelectorAll('.resource-card').forEach((c, i) => {
        c.style.animation = `slideIn 0.3s ease ${i * 0.08}s both`;
    });

    // quick-actions panel (if present) - ensure event delegation
    document.querySelectorAll('[data-resource]').forEach(btn => {
        // ensure button is clickable (if dynamically created)
        btn.addEventListener('click', (e) => {
            const res = btn.getAttribute('data-resource');
            if (res) this.openResource(res);
        });
    });

    // wire modal close
    const closeBtn = document.getElementById('close-resource-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('resource-modal');
        if (modal) modal.classList.add('hidden');
    });

    // optional: close modal on overlay click
    const modal = document.getElementById('resource-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
}

/**
 * Open a resource in modal.
 * Also wires internal "play" buttons inside modal and notifies chatbot for a follow-up hint.
 */
openResource(resourceType) {
    const modal = document.getElementById('resource-modal');
    const title = document.getElementById('resource-modal-title');
    const content = document.getElementById('resource-modal-content');

    if (!modal || !title || !content) {
        console.error('Resource modal elements not found');
        return;
    }

    // Resources map — extend / adjust text & placeholders as needed
    const resources = {
        'breathing': {
            title: '5-Minute Breathing Exercise',
            html: `
                <div class="resource-content">
                    <h3>Progressive Breathing</h3>
                    <p>Find a comfortable seated position. Follow this:</p>
                    <ol>
                        <li>Inhale slowly for 4 counts</li>
                        <li>Hold for 4 counts</li>
                        <li>Exhale for 6 counts</li>
                        <li>Repeat 8–10 times</li>
                    </ol>
                    <p><em>Use this whenever stress spikes — 2–5 minutes is often enough to calm down.</em></p>
                    <div class="resource-media" style="margin-top:12px;">
                        <button class="btn" data-action="play-audio" data-audio="breathing">Play audio guide ▶</button>
                    </div>
                </div>
            `
        },
        'meditation': {
            title: '3-Min Study Break Meditation',
            html: `
                <div class="resource-content">
                    <h3>Quick Meditation</h3>
                    <p>A short reset useful during study sessions.</p>
                    <ul>
                        <li>Sit upright, feet on floor</li>
                        <li>Close eyes and focus on breath</li>
                        <li>Return gently when mind wanders</li>
                    </ul>
                    <div class="resource-media" style="margin-top:12px;">
                        <button class="btn" data-action="play-video" data-video="meditation-short">Play 3-min guide ▶</button>
                    </div>
                </div>
            `
        },
        'sleep': {
            title: 'Sleep Hygiene Guide',
            html: `
                <div class="resource-content">
                    <h3>Better sleep tips</h3>
                    <ul>
                        <li>Keep consistent bed/wake times</li>
                        <li>No screens 1 hour before bed</li>
                        <li>Keep room cool & dark</li>
                    </ul>
                    <p><em>Try this bedtime routine tonight: light stretching → warm drink → read 10 mins.</em></p>
                </div>
            `
        },
        'anxiety-sounds': {
            title: 'Calming Soundscapes',
            html: `
                <div class="resource-content">
                    <h3>Soundscapes</h3>
                    <p>Try these for 10–20 minutes to relax:</p>
                    <ul><li>Ocean waves</li><li>Gentle rain</li><li>Forest ambience</li></ul>
                    <div class="resource-media" style="margin-top:12px;">
                        <button class="btn" data-action="play-audio" data-audio="ocean">Play Ocean ▶</button>
                        <button class="btn" data-action="play-audio" data-audio="rain">Play Rain ▶</button>
                    </div>
                </div>
            `
        },
        'mood-techniques': {
            title: 'Mood Lifting Techniques',
            html: `
                <div class="resource-content">
                    <h3>Small actions, big effect</h3>
                    <ol>
                        <li>Write 3 things you're grateful for</li>
                        <li>Take a 5-minute walk</li>
                        <li>Text a friend — keep it short</li>
                    </ol>
                    <p><em>Try one now and notice how you feel after 5 minutes.</em></p>
                </div>
            `
        },
        'connections': {
            title: 'Building Meaningful Connections',
            html: `
                <div class="resource-content">
                    <h3>How to meet people</h3>
                    <ul>
                        <li>Join one club this month</li>
                        <li>Ask about someone's project — people like that</li>
                        <li>Volunteer once to meet like-minded folks</li>
                    </ul>
                </div>
            `
        },
        'relaxation-audio': {
            title: 'Guided Relaxation (10 min)',
            html: `
                <div class="resource-content">
                    <h3>Guided Relaxation</h3>
                    <p>Progressive muscle relaxation + breath work.</p>
                    <div class="resource-media" style="margin-top:12px;">
                        <button class="btn" data-action="play-audio" data-audio="relax10">Play 10-min guide ▶</button>
                    </div>
                </div>
            `
        },
        'self-help-guide': {
            title: 'Self-Help Steps & Crisis Resources',
            html: `
                <div class="resource-content">
                    <h3>Quick Self-Help</h3>
                    <ol>
                        <li>Pause — 3 deep breaths</li>
                        <li>Label the feeling</li>
                        <li>Ground: 5 things you see, 4 you touch, 3 you hear</li>
                    </ol>
                    <h4 style="margin-top:12px;">If you feel unsafe</h4>
                    <p>Contact local emergency services or campus counseling. Crisis Helpline: 1-800-HELP-NOW</p>
                </div>
            `
        }
    };

    const chosen = resources[resourceType] || { title: 'Resource not available', html: '<p>Try another one.</p>' };

    title.textContent = chosen.title;
    content.innerHTML = chosen.html;
    modal.classList.remove('hidden');

    // wire internal buttons (play audio / video)
    content.querySelectorAll('button[data-action]').forEach(btn => {
        // remove existing listener if any (idempotent)
        btn.replaceWith(btn.cloneNode(true));
    });
    // re-select after cloning
    content.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const action = btn.getAttribute('data-action');
            const audioId = btn.getAttribute('data-audio');
            const videoId = btn.getAttribute('data-video');
            if (action === 'play-audio' && audioId) {
                this.playResourceAudio(audioId);
            } else if (action === 'play-video' && videoId) {
                // placeholder — replace with real player integration if available
                alert('Video player placeholder — integrate your video here.');
            }
        });
    });

    // notify chatbot with a helpful follow-up prompt
    this.addBotMessage(`You opened "${chosen.title}". Would you like quick tips to use this resource effectively or a short guided option?`);
}

/**
 * Simple audio player for resource sounds (placeholder sources).
 * Keeps a single global audio instance to avoid multiple sounds playing.
 */
playResourceAudio(audioId) {
    if (!window._sukoonAudio) window._sukoonAudio = new Audio();
    const map = {
        'breathing': 'https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg',
        'ocean': 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg',
        'rain': 'https://actions.google.com/sounds/v1/weather/rain.ogg',
        'relax10': 'https://actions.google.com/sounds/v1/alarms/air_horn.ogg' // replace with real relaxation audio later
    };
    const src = map[audioId] || map['breathing'];
    if (window._sukoonAudio.src !== src) {
        window._sukoonAudio.pause();
        window._sukoonAudio.src = src;
    }
    window._sukoonAudio.currentTime = 0;
    window._sukoonAudio.play().catch(() => {
        // fallback: show friendly message if audio blocked
        this.addBotMessage("Audio playback blocked by browser — tap the play button again or allow sound.");
    });
}

    // =========================
    // USER DASHBOARD
    // =========================
    initializeUserDashboard() {
        this.updateUserName();
        document.querySelectorAll('.dashboard-card').forEach((c, i) => {
            c.style.animation = `slideIn 0.5s ease ${i * 0.1}s both`;
        });
    }
}
// =============================
// WELLNESS — TIMER + MOOD TRACKER (CLEANED)
// =============================

(function () {
    // ---- ELEMENTS ----
    const preset = document.getElementById('timer-preset');
    const customWrapper = document.getElementById('custom-wrapper');
    const customMinInput = document.getElementById('timer-custom-min');
    const display = document.getElementById('timer-display');
    const btnStart = document.getElementById('timer-start');
    const btnPause = document.getElementById('timer-pause');
    const btnStop = document.getElementById('timer-stop');
    const label = document.querySelector('.timer-label');
    const ring = document.querySelector('.progress-ring .ring');

    // Mood elements
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodNote = document.getElementById('mood-note');
    const saveMoodBtn = document.getElementById('save-mood');
    const exportBtn = document.getElementById('export-mood');
    const moodMsg = document.getElementById('mood-msg');

    // ---- TIMER STATE ----
    let totalSeconds = 60;
    let remaining = 60;
    let intervalId = null;
    let running = false;
    let paused = false;

    // Bell sound
    const bell = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

    // ---- RING GEOMETRY ----
    const R = 52;
    const C = 2 * Math.PI * R;

    if (ring) {
        ring.style.strokeDasharray = `${C}`;
        ring.style.strokeDashoffset = `${C}`;
    }

    // ---- TIMER UTILS ----
    function getSelectedSeconds() {
        if (!preset) return 60;
        if (preset.value === "custom") {
            const m = parseInt(customMinInput.value, 10);
            if (!m || m <= 0) return null;
            return m * 60;
        } else {
            return parseInt(preset.value, 10) || 60;
        }
    }

    function secToMMSS(s) {
        const m = String(Math.floor(s / 60)).padStart(2, '0');
        const sec = String(s % 60).padStart(2, '0');
        return `${m}:${sec}`;
    }

    function drawProgress() {
        if (!ring || totalSeconds <= 0) return;
        const pct = Math.max(0, Math.min(1, (totalSeconds - remaining) / totalSeconds));
        const offset = C - (C * pct);
        ring.style.strokeDashoffset = offset;
    }

    function updateUI() {
        display.textContent = secToMMSS(remaining);
        if (running) label.textContent = "Running";
        else if (paused) label.textContent = "Paused";
        else label.textContent = "Ready";

        drawProgress();
    }

    // ---- TIMER MAIN ----
    function startTimer() {
        if (running) return;

        const secs = getSelectedSeconds();
        if (secs === null) {
            alert("Invalid time! Enter minutes 1–180.");
            customMinInput.focus();
            return;
        }

        if (!paused) {
            totalSeconds = secs;
            remaining = secs;
        }

        running = true;
        paused = false;

        btnStart.disabled = true;
        btnPause.disabled = false;
        btnStop.disabled = false;

        intervalId = setInterval(() => {
            remaining--;
            updateUI();

            if (remaining <= 0) {
                clearInterval(intervalId);
                running = false;
                paused = false;

                label.textContent = "Done";
                bell.play().catch(() => {});

                btnStart.disabled = false;
                btnPause.disabled = true;
                btnStop.disabled = true;
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!running) return;
        clearInterval(intervalId);

        running = false;
        paused = true;

        btnStart.disabled = false;
        btnPause.disabled = true;
    }

    function stopTimer() {
        clearInterval(intervalId);

        const secs = getSelectedSeconds() ?? 60;

        running = false;
        paused = false;

        totalSeconds = secs;
        remaining = secs;

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = true;

        updateUI();
    }

    // ---- PRESET HANDLER ----
    function handlePresetChange() {
        if (preset.value === "custom") {
            customWrapper.style.display = "flex";
            customMinInput.focus();
        } else {
            customWrapper.style.display = "none";
        }

        // If not running, update preview timer
        if (!running) {
            totalSeconds = getSelectedSeconds() || 60;
            remaining = totalSeconds;
            updateUI();
        }
    }

    // ---- INIT TIMER ----
    if (preset) preset.addEventListener("change", handlePresetChange);

    if (customMinInput) {
        customMinInput.addEventListener("input", () => {
            let v = parseInt(customMinInput.value, 10);

            if (v > 180) { v = 180; customMinInput.value = 180; }
            if (v < 1) { v = 1; customMinInput.value = 1; }

            if (!running) {
                totalSeconds = v * 60;
                remaining = totalSeconds;
                updateUI();
            }
        });
    }

    if (preset && preset.value !== "custom") customWrapper.style.display = "none";

    updateUI();

    // ---- BUTTON BIND ----
    btnStart?.addEventListener("click", startTimer);
    btnPause?.addEventListener("click", pauseTimer);
    btnStop?.addEventListener("click", stopTimer);

    // =============================
    // MOOD TRACKER (CLEAN VERSION)
    // =============================

    let selectedMood = null;
    const STORAGE_KEY = "sukoon_mood_logs";

    moodBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            moodBtns.forEach(x => x.classList.remove("active"));
            btn.classList.add("active");
            selectedMood = btn.dataset.mood;
        });
    });

    function saveMood() {
        if (!selectedMood) {
            moodMsg.textContent = "Pehle mood choose karo!";
            moodMsg.style.color = "crimson";
            return;
        }

        const entry = {
            ts: new Date().toISOString(),
            mood: selectedMood,
            note: moodNote.value || ""
        };

        const now = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        now.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(now));

        moodMsg.textContent = "Mood saved ✔";
        moodMsg.style.color = "green";

        moodBtns.forEach(x => x.classList.remove("active"));
        selectedMood = null;
        moodNote.value = "";
    }

    saveMoodBtn?.addEventListener("click", saveMood);

    // ---- EXPORT CSV ----
    function exportCSV() {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!logs.length) {
            moodMsg.textContent = "No mood logs!";
            moodMsg.style.color = "crimson";
            return;
        }

        const rows = [["timestamp", "mood", "note"]];
        logs.forEach(r => rows.push([
            r.ts,
            r.mood,
            (r.note || "").replace(/\n/g, " ")
        ]));

        const csv = rows.map(r =>
            r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")
        ).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "sukoon_mood_logs.csv";
        a.click();
        URL.revokeObjectURL(url);

        moodMsg.textContent = "Exported ✔";
        moodMsg.style.color = "green";
    }

    exportBtn?.addEventListener("click", exportCSV);

})();
// =============================
// MOOD HISTORY CHART (Chart.js) — CLEAN VERSION
// =============================

(function () {
    const KEY = "sukoon_mood_logs";
    const canvas = document.getElementById("moodChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const MOOD_SCORE = {
        "very_happy": 5,
        "happy": 4,
        "neutral": 3,
        "sad": 2,
        "very_sad": 1
    };

    function loadLogs() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "[]");
        } catch {
            return [];
        }
    }

    function getLast14Days() {
        const arr = [];
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            arr.push(d);
        }
        return arr;
    }

    function aggregateDaily() {
        const logs = loadLogs();
        const days = getLast14Days();

        const labels = days.map((d) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            return `${dd}/${mm}`;
        });

        const sums = Array(14).fill(0);
        const counts = Array(14).fill(0);

        logs.forEach(l => {
            const t = new Date(l.ts);
            for (let i = 0; i < days.length; i++) {
                if (
                    t.getFullYear() === days[i].getFullYear() &&
                    t.getMonth() === days[i].getMonth() &&
                    t.getDate() === days[i].getDate()
                ) {
                    sums[i] += MOOD_SCORE[l.mood] || 3;
                    counts[i] += 1;
                }
            }
        });

        const avg = sums.map((s, i) => counts[i] ? +(s / counts[i]).toFixed(2) : NaN);

        return { labels, avg };
    }

    function createMoodChart() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(43,108,176,0.22)");
        gradient.addColorStop(1, "rgba(43,108,176,0.05)");

        const { labels, avg } = aggregateDaily();

        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Mood Score (14 Days)",
                    data: avg,
                    tension: 0.3,
                    borderWidth: 3,
                    borderColor: "#2b6cb0",
                    backgroundColor: gradient,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#2b6cb0",
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        suggestedMin: 1,
                        suggestedMax: 5,
                        ticks: { stepSize: 1 }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        return chart;
    }

    document.addEventListener("DOMContentLoaded", () => {
        createMoodChart();
    });

})();


// =============================
// ADMIN DASHBOARD CHARTS
// =============================
class DashboardCharts {
    static init() {
        this.sessionsChart();
        this.appointmentChart();
    }

    static sessionsChart() {
        const el = document.getElementById("sessionsChart");
        if (!el) return;

        const ctx = el.getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Chat Sessions",
                    data: [45, 52, 38, 67, 73, 28, 34],
                    borderColor: "#a8e6cf",
                    backgroundColor: "rgba(168,230,207,0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    static appointmentChart() {
        const el = document.getElementById("appointmentsChart");
        if (!el) return;

        const ctx = el.getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Dr. Sharma", "Dr. Meena", "Dr. Patel", "Dr. Kumar"],
                datasets: [{
                    label: "Appointments",
                    data: [42, 38, 35, 41],
                    backgroundColor: ["#a8e6cf", "#dcedf2", "#e0c3fc", "rgba(168, 230, 207, 0.7)"],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }
}


// =============================
// COUNTER ANIMATIONS
// =============================
function animateCounters() {
    const counters = [
        { id: 'total-users', target: 1247 },
        { id: 'chat-sessions', target: 3892 },
        { id: 'appointments', target: 156 },
        { id: 'resource-views', target: 2834 }
    ];

    counters.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;

        const duration = 1500;
        const start = performance.now();

        function frame(t) {
            const progress = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(c.target * eased);

            el.textContent = value.toLocaleString();

            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    });
}


// =============================
// SUCCESS MODAL
// =============================
function showSuccessMessage(msg) {
    const modal = document.getElementById("success-modal");
    const box = document.getElementById("success-message");

    if (!modal || !box) return alert(msg);

    box.textContent = msg;
    modal.classList.remove("hidden");

    setTimeout(() => modal.classList.add("hidden"), 2500);
}


// =============================
// GLOBAL INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sukoon Loaded Successfully ✔");

    // Initialize main app
    const app = new WellnessPortal();
    window.sukoon = app;

    // Admin charts
    DashboardCharts.init();

    // Counters
    setTimeout(() => animateCounters(), 300);

    // Smooth scroll
    document.documentElement.style.scrollBehavior = "smooth";

    // Card animations
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add("animate-in");
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.card-3d, .feature-card').forEach(card => obs.observe(card));

    // Floating background parallax
    const bg = document.querySelector(".hero-background");
    if (bg) {
        window.addEventListener("scroll", () => {
            const y = window.pageYOffset * -0.3;
            bg.style.transform = `translate3d(0, ${y}px, 0)`;
        });
    }

    // Add floating animation via JS
    const style = document.createElement('style');
    style.textContent = `
        .animate-in { animation: slideInUp 0.6s ease forwards; }
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
