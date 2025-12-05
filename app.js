// Student Wellness Portal - JavaScript (Fixed Version)

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
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setupCharts();
            this.animateCounters();
        }, 100);
    }

    setupEventListeners() {
        // Navigation - Fixed event delegation
        document.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Page navigation - Fixed to handle all navigation properly
            if (e.target.hasAttribute('data-page')) {
                const page = e.target.getAttribute('data-page');
                console.log('Navigating to:', page); // Debug log
                this.navigateToPage(page);
                return;
            }
            
            // Check if clicked element is inside an element with data-page
            if (e.target.closest('[data-page]')) {
                const element = e.target.closest('[data-page]');
                const page = element.getAttribute('data-page');
                console.log('Navigating to (nested):', page); // Debug log
                this.navigateToPage(page);
                return;
            }

            // Mobile menu toggle
            if (e.target.id === 'nav-toggle' || e.target.closest('#nav-toggle')) {
                this.toggleMobileMenu();
                return;
            }

            // Time slot selection
            if (e.target.classList.contains('time-slot')) {
                this.selectTimeSlot(e.target);
                return;
            }

            // Quick action buttons in chat
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.getAttribute('data-action');
                if (action) {
                    this.handleQuickAction(action);
                } else if (e.target.hasAttribute('data-page')) {
                    const page = e.target.getAttribute('data-page');
                    this.navigateToPage(page);
                }
                return;
            }

            // Post action buttons
            if (e.target.classList.contains('post-action-btn')) {
                this.handlePostAction(e.target);
                return;
            }

            // Mood buttons
            if (e.target.classList.contains('mood-btn')) {
                this.handleMoodSelection(e.target);
                return;
            }

            // Modal close buttons
            if (e.target.classList.contains('close-btn') || e.target.id.includes('close-')) {
                this.closeModals();
                return;
            }

            // Resource buttons
            if (e.target.hasAttribute('data-resource')) {
                const resource = e.target.getAttribute('data-resource');
                this.openResource(resource);
                return;
            }

            // Admin navigation
            if (e.target.classList.contains('admin-nav-link')) {
                const section = e.target.getAttribute('data-admin-section');
                this.switchAdminSection(section);
                return;
            }

            // Nav links - make sure they work
            if (e.target.classList.contains('nav-link')) {
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
                return;
            }
        });

        // Form submissions
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
        }

        // Chat functionality - Fixed
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        if (chatInput && sendBtn) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendChatMessage();
            });
        }

        const submitPostBtn = document.getElementById('submit-post');
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitForumPost();
            });
        }

        // Search and filter functionality
        const resourceSearch = document.getElementById('resource-search');
        const categoryFilter = document.getElementById('category-filter');
        
        if (resourceSearch) {
            resourceSearch.addEventListener('input', () => this.filterResources());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterResources());
        }

        // Date input setup for booking
        const appointmentDate = document.getElementById('appointment-date');
        if (appointmentDate) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            appointmentDate.min = tomorrow.toISOString().split('T')[0];
            
            const maxDate = new Date(today);
            maxDate.setDate(maxDate.getDate() + 30);
            appointmentDate.max = maxDate.toISOString().split('T')[0];
        }
    }

    navigateToPage(page) {
        console.log('Navigating to page:', page); // Debug log
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => {
            p.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Update nav active state
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            
            const activeLinks = document.querySelectorAll(`[data-page="${page}"]`);
            activeLinks.forEach(link => {
                if (link.classList.contains('nav-link')) {
                    link.classList.add('active');
                }
            });

            // Page-specific initialization
            this.initializePage(page);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            console.log('Successfully navigated to:', page); // Debug log
        } else {
            console.error('Page not found:', page); // Debug log
        }

        // Close mobile menu if open
        this.closeMobileMenu();
    }

    initializePage(page) {
        switch (page) {
            case 'chatbot':
                this.initializeChatbot();
                break;
            case 'admin':
                setTimeout(() => {
                    this.initializeAdminDashboard();
                }, 100);
                break;
            case 'dashboard':
                this.initializeUserDashboard();
                break;
            case 'resources':
                this.initializeResources();
                break;
            case 'home':
                this.initializeHome();
                break;
        }
    }

    initializeHome() {
        // Animate floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const anonymousMode = document.getElementById('anonymous-mode').checked;
        
        if (email && password) {
            this.isLoggedIn = true;
            this.currentUser = {
                email: email,
                name: anonymousMode ? 'User123' : email.split('@')[0],
                anonymous: anonymousMode
            };
            
            this.showSuccessMessage('Login successful! Welcome to your wellness journey.');
            
            setTimeout(() => {
                this.navigateToPage('dashboard');
                this.updateUserName();
            }, 2000);
        }
    }

    updateUserName() {
        const userNameElements = document.querySelectorAll('#user-name');
        userNameElements.forEach(element => {
            if (this.currentUser) {
                element.textContent = this.currentUser.name;
            }
        });
    }

    handleBooking(e) {
        e.preventDefault();
        
        const counselor = document.getElementById('counselor-select').value;
        const date = document.getElementById('appointment-date').value;
        
        if (counselor && date && this.selectedTimeSlot) {
            const ticketId = '#A' + Math.random().toString(36).substr(2, 5).toUpperCase();
            this.showSuccessMessage(`Appointment booked successfully! Your Ticket ID: ${ticketId}`);
            
            // Reset form
            document.getElementById('booking-form').reset();
            this.clearTimeSlotSelection();
        } else {
            alert('Please fill all fields and select a time slot.');
        }
    }

    selectTimeSlot(slot) {
        // Clear previous selection
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        
        // Select new slot
        slot.classList.add('selected');
        this.selectedTimeSlot = slot.getAttribute('data-time');
    }

    clearTimeSlotSelection() {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        this.selectedTimeSlot = null;
    }

    initializeChatbot() {
        const chatArea = document.getElementById('chat-area');
        if (chatArea) {
            // Clear any existing messages except the welcome message
            const existingMessages = chatArea.querySelectorAll('.message');
            if (existingMessages.length <= 1) {
                // Add a more detailed welcome message
                setTimeout(() => {
                    this.addBotMessage("I'm here to help you with any concerns you might have. You can ask me about stress management, study tips, or any mental health topics. What would you like to talk about today?");
                }, 500);
            }
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        console.log('Sending message:', message); // Debug log
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            
            // Simulate bot response with typing indicator
            this.addTypingIndicator();
            setTimeout(() => {
                this.removeTypingIndicator();
                this.generateBotResponse(message);
            }, 1000 + Math.random() * 2000);
        }
    }

    addUserMessage(message) {
        const chatArea = document.getElementById('chat-area');
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${this.escapeHtml(message)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
            <div class="message-avatar">👤</div>
        `;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        
        console.log('Added user message:', message); // Debug log
    }

    addBotMessage(message) {
        const chatArea = document.getElementById('chat-area');
        if (!chatArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <p>${message}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        
        console.log('Added bot message:', message); // Debug log
    }

    addTypingIndicator() {
        const chatArea = document.getElementById('chat-area');
        if (!chatArea) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatArea.appendChild(typingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    generateBotResponse(userMessage) {
        const responses = [
            "I understand how you're feeling. It's completely normal to experience these emotions during college.",
            "Thank you for sharing that with me. Can you tell me more about what's been troubling you?",
            "It sounds like you're going through a challenging time. Remember, seeking help is a sign of strength.",
            "Have you tried any relaxation techniques? I can guide you through some breathing exercises.",
            "Your mental health is just as important as your physical health. Let's work on some coping strategies.",
            "It's great that you're reaching out. What would you like to focus on today?",
            "I'm here to listen without judgment. Your feelings are valid and important.",
        ];
        
        const keywords = userMessage.toLowerCase();
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // Context-aware responses
        if (keywords.includes('stress') || keywords.includes('anxious')) {
            response = "I can hear that you're feeling stressed. Stress is very common among students. Would you like me to suggest some immediate stress-relief techniques or breathing exercises?";
        } else if (keywords.includes('exam') || keywords.includes('study')) {
            response = "Exam periods can be overwhelming. It's important to balance study with self-care. Have you been taking regular breaks? I can suggest some study break meditation techniques.";
        } else if (keywords.includes('sleep') || keywords.includes('tired')) {
            response = "Sleep is crucial for mental health and academic performance. What's your current sleep schedule like? I have some sleep hygiene tips that might help.";
        } else if (keywords.includes('lonely') || keywords.includes('alone')) {
            response = "Feeling lonely is tough, especially in college. Remember that many students feel this way. Have you considered joining our peer support forum to connect with others?";
        } else if (keywords.includes('hello') || keywords.includes('hi')) {
            response = "Hello! I'm glad you're here. I'm your wellness assistant, and I'm here to provide support and guidance. How are you feeling today?";
        }
        
        this.addBotMessage(response);
    }

    handleQuickAction(action) {
        console.log('Handling quick action:', action); // Debug log
        
        switch (action) {
            case 'relaxation':
                this.openResource('relaxation-audio');
                break;
            case 'guide':
                this.openResource('self-help-guide');
                break;
            case 'book':
                this.navigateToPage('booking');
                break;
        }
    }

    openResource(resourceType) {
        const modal = document.getElementById('resource-modal');
        const title = document.getElementById('resource-modal-title');
        const content = document.getElementById('resource-modal-content');
        
        if (!modal || !title || !content) {
            console.error('Resource modal elements not found');
            return;
        }
        
        const resources = {
            'breathing': {
                title: '5-Minute Breathing Exercise',
                content: `
                    <div class="resource-content">
                        <p><strong>Progressive Breathing Technique</strong></p>
                        <ol>
                            <li>Find a comfortable seated position</li>
                            <li>Close your eyes and breathe naturally</li>
                            <li>Inhale slowly for 4 counts</li>
                            <li>Hold your breath for 4 counts</li>
                            <li>Exhale slowly for 6 counts</li>
                            <li>Repeat this cycle 10 times</li>
                        </ol>
                        <p style="margin-top: 20px;"><em>This exercise can help reduce stress and anxiety in just 5 minutes.</em></p>
                        <div style="margin-top: 15px; padding: 15px; background: #f0f8f4; border-radius: 8px;">
                            <strong>Audio Guide:</strong> A calming voice would guide you through this breathing exercise.
                        </div>
                    </div>
                `
            },
            'meditation': {
                title: 'Study Break Meditation',
                content: `
                    <div class="resource-content">
                        <p><strong>Quick Meditation for Students</strong></p>
                        <p>This 3-minute meditation is perfect for study breaks:</p>
                        <ul>
                            <li>Sit comfortably in your study space</li>
                            <li>Set a gentle 3-minute timer</li>
                            <li>Focus on your breathing</li>
                            <li>When thoughts arise, gently return focus to breath</li>
                            <li>End with 3 deep breaths</li>
                        </ul>
                        <div style="margin-top: 20px; padding: 15px; background: #f0f8f4; border-radius: 8px;">
                            <strong>Video Guide:</strong> A 3-minute guided meditation video would play here.
                        </div>
                    </div>
                `
            },
            'sleep': {
                title: 'Sleep Hygiene Guide',
                content: `
                    <div class="resource-content">
                        <p><strong>Better Sleep for Better Grades</strong></p>
                        <h4>Sleep Hygiene Tips:</h4>
                        <ul>
                            <li><strong>Consistent Schedule:</strong> Sleep and wake at the same time daily</li>
                            <li><strong>Screen Time:</strong> Avoid screens 1 hour before bed</li>
                            <li><strong>Environment:</strong> Keep your room cool, dark, and quiet</li>
                            <li><strong>Caffeine:</strong> No caffeine after 2 PM</li>
                            <li><strong>Exercise:</strong> Regular physical activity, but not before bedtime</li>
                            <li><strong>Relaxation:</strong> Try reading or gentle stretching before bed</li>
                        </ul>
                        <div style="margin-top: 15px; padding: 10px; background: #e8f4fd; border-radius: 5px;">
                            <strong>Quick Tip:</strong> If you can't fall asleep within 20 minutes, get up and do a quiet activity until sleepy.
                        </div>
                    </div>
                `
            },
            'anxiety-sounds': {
                title: 'Anxiety Relief Sounds',
                content: `
                    <div class="resource-content">
                        <p><strong>Calming Soundscapes</strong></p>
                        <p>Listen to these soothing sounds to help manage anxiety:</p>
                        <div style="margin: 15px 0; padding: 15px; background: #f0f8f4; border-radius: 8px;">
                            <strong>Available Sounds:</strong>
                            <ul style="margin-top: 10px;">
                                <li>Ocean waves and seagulls</li>
                                <li>Gentle rain on leaves</li>
                                <li>Forest sounds with birds</li>
                                <li>Soft piano meditation music</li>
                            </ul>
                        </div>
                        <p><em>These soundscapes are designed to activate your body's relaxation response.</em></p>
                    </div>
                `
            },
            'mood-techniques': {
                title: 'Mood Lifting Techniques',
                content: `
                    <div class="resource-content">
                        <p><strong>Evidence-Based Mood Improvement</strong></p>
                        <h4>Quick Mood Boosters:</h4>
                        <ol>
                            <li><strong>Gratitude Practice:</strong> Write down 3 things you're grateful for</li>
                            <li><strong>Physical Movement:</strong> Take a 5-minute walk or stretch</li>
                            <li><strong>Connect:</strong> Text a friend or family member</li>
                            <li><strong>Mindful Breathing:</strong> Take 10 slow, deep breaths</li>
                            <li><strong>Listen to Music:</strong> Play your favorite uplifting song</li>
                        </ol>
                        <div style="margin-top: 15px; padding: 10px; background: #fef7e0; border-radius: 5px;">
                            <strong>Remember:</strong> Small actions can lead to big changes in how you feel.
                        </div>
                    </div>
                `
            },
            'connections': {
                title: 'Building Connections',
                content: `
                    <div class="resource-content">
                        <p><strong>Making Meaningful Friendships</strong></p>
                        <h4>Connection Strategies:</h4>
                        <ul>
                            <li><strong>Join clubs:</strong> Find groups that match your interests</li>
                            <li><strong>Study groups:</strong> Connect over shared academic goals</li>
                            <li><strong>Volunteer work:</strong> Meet like-minded people while helping others</li>
                            <li><strong>Campus events:</strong> Attend social activities and workshops</li>
                            <li><strong>Be genuine:</strong> Authentic connections are stronger</li>
                        </ul>
                        <div style="margin-top: 20px; padding: 15px; background: #f0f8f4; border-radius: 8px;">
                            <strong>Video Guide:</strong> Tips for overcoming social anxiety and building confidence in social situations.
                        </div>
                    </div>
                `
            },
            'relaxation-audio': {
                title: 'Relaxation Audio',
                content: `
                    <div class="resource-content">
                        <p><strong>Guided Relaxation Session</strong></p>
                        <p>This calming audio session includes:</p>
                        <ul>
                            <li>Progressive muscle relaxation</li>
                            <li>Breathing exercises</li>
                            <li>Mindfulness techniques</li>
                            <li>Positive affirmations</li>
                        </ul>
                        <div style="margin: 15px 0; padding: 15px; background: #f0f8f4; border-radius: 8px;">
                            <strong>Audio Player:</strong> A 10-minute guided relaxation session would play here.
                        </div>
                        <p><em>Find a quiet, comfortable space and let the guide help you relax completely.</em></p>
                    </div>
                `
            },
            'self-help-guide': {
                title: 'Self-Help Guide',
                content: `
                    <div class="resource-content">
                        <p><strong>Quick Self-Help Strategies</strong></p>
                        <h4>When feeling overwhelmed:</h4>
                        <ol>
                            <li><strong>Pause:</strong> Take 3 deep breaths</li>
                            <li><strong>Identify:</strong> Name what you're feeling</li>
                            <li><strong>Ground:</strong> Notice 5 things you can see, 4 you can touch, 3 you can hear</li>
                            <li><strong>Act:</strong> Choose one small, manageable task</li>
                            <li><strong>Reach out:</strong> Talk to someone you trust</li>
                        </ol>
                        <div style="margin-top: 15px; padding: 10px; background: #fef7e0; border-radius: 5px;">
                            <strong>Remember:</strong> It's okay to not be okay. Seeking help is courageous.
                        </div>
                        <h4 style="margin-top: 20px;">Crisis Resources:</h4>
                        <p>If you're having thoughts of self-harm, please reach out immediately:</p>
                        <ul>
                            <li>Campus Counseling: Available 24/7</li>
                            <li>Crisis Helpline: 1-800-HELP-NOW</li>
                            <li>Text "HOME" to 741741 for crisis support</li>
                        </ul>
                    </div>
                `
            }
        };
        
        const resource = resources[resourceType] || {
            title: 'Resource Not Available',
            content: '<p>This resource is currently unavailable. Please try again later or contact support.</p>'
        };
        
        title.textContent = resource.title;
        content.innerHTML = resource.content;
        modal.classList.remove('hidden');
        
        console.log('Opened resource:', resourceType); // Debug log
    }

    submitForumPost() {
        const textarea = document.getElementById('new-post-content');
        const content = textarea.value.trim();
        
        if (content) {
            this.addForumPost(content);
            textarea.value = '';
        } else {
            alert('Please write something to share with the community.');
        }
    }

    addForumPost(content) {
        const forumPosts = document.getElementById('forum-posts');
        if (!forumPosts) return;
        
        const postDiv = document.createElement('div');
        const userAlias = 'User' + Math.floor(Math.random() * 999);
        
        postDiv.className = 'forum-post card-3d';
        postDiv.style.animation = 'slideIn 0.5s ease';
        postDiv.innerHTML = `
            <div class="post-header">
                <span class="post-author">${userAlias}</span>
                <span class="post-time">Just now</span>
            </div>
            <div class="post-content">
                <p>${this.escapeHtml(content)}</p>
            </div>
            <div class="post-actions">
                <button class="post-action-btn upvote">👍 <span>0</span></button>
                <button class="post-action-btn comment">💬 Comment</button>
                <button class="post-action-btn report">⚠️ Report</button>
            </div>
        `;
        
        forumPosts.insertBefore(postDiv, forumPosts.firstChild);
    }

    handlePostAction(button) {
        const action = button.classList.contains('upvote') ? 'upvote' : 
                     button.classList.contains('comment') ? 'comment' : 'report';
        
        switch (action) {
            case 'upvote':
                const countSpan = button.querySelector('span');
                const currentCount = parseInt(countSpan.textContent);
                countSpan.textContent = currentCount + 1;
                button.style.color = '#a8e6cf';
                break;
            case 'comment':
                alert('Comment feature coming soon!');
                break;
            case 'report':
                if (confirm('Report this post to moderators?')) {
                    alert('Post reported. Thank you for helping maintain a positive community.');
                }
                break;
        }
    }

    handleMoodSelection(button) {
        // Clear previous selection
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Select current mood
        button.classList.add('selected');
        
        const mood = button.getAttribute('data-mood');
        this.showSuccessMessage(`Mood logged: ${button.textContent}. Thank you for checking in!`);
        
        // Provide contextual suggestion based on mood
        setTimeout(() => {
            let suggestion = '';
            switch (mood) {
                case 'stressed':
                    suggestion = 'Try our 5-minute breathing exercise to help manage stress.';
                    break;
                case 'down':
                    suggestion = 'Consider talking to our chatbot or booking a counseling session.';
                    break;
                case 'okay':
                    suggestion = 'Browse our resource hub for wellness tips and strategies.';
                    break;
                default:
                    suggestion = 'Keep up the positive momentum! Check out our community forum.';
            }
            
            if (suggestion) {
                const moodCard = document.querySelector('.mood-tracker');
                if (moodCard) {
                    const existingSuggestion = moodCard.querySelector('.mood-suggestion');
                    if (existingSuggestion) {
                        existingSuggestion.remove();
                    }
                    
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.className = 'mood-suggestion';
                    suggestionDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(168, 230, 207, 0.1); border-radius: 5px; font-size: 14px; color: #666;';
                    suggestionDiv.textContent = suggestion;
                    moodCard.appendChild(suggestionDiv);
                }
            }
        }, 2000);
    }

    filterResources() {
        const searchTerm = document.getElementById('resource-search')?.value.toLowerCase() || '';
        const selectedCategory = document.getElementById('category-filter')?.value || '';
        
        const resourceCards = document.querySelectorAll('.resource-card');
        
        resourceCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const category = card.getAttribute('data-category') || '';
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    initializeResources() {
        // Initialize resource filtering
        this.filterResources();
        
        // Animate resource cards
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach((card, index) => {
            card.style.animation = `slideIn 0.3s ease ${index * 0.1}s both`;
        });
    }

    initializeUserDashboard() {
        if (this.currentUser) {
            this.updateUserName();
        }
        
        // Animate dashboard cards
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            card.style.animation = `slideIn 0.5s ease ${index * 0.1}s both`;
        });
    }

    initializeAdminDashboard() {
        this.animateCounters();
        setTimeout(() => {
            this.setupCharts();
        }, 500);
    }

    switchAdminSection(section) {
        // Update active nav link
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-admin-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Show/hide sections (for demo, we only have overview)
        if (section === 'overview') {
            // Overview is always visible in our demo
        }
    }

    setupCharts() {
        // Sessions Chart
        const sessionsCtx = document.getElementById('sessionsChart');
        if (sessionsCtx && typeof Chart !== 'undefined') {
            try {
                new Chart(sessionsCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Chat Sessions',
                            data: [45, 52, 38, 67, 73, 28, 34],
                            borderColor: '#a8e6cf',
                            backgroundColor: 'rgba(168, 230, 207, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating sessions chart:', error);
            }
        }

        // Appointments Chart
        const appointmentsCtx = document.getElementById('appointmentsChart');
        if (appointmentsCtx && typeof Chart !== 'undefined') {
            try {
                new Chart(appointmentsCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Dr. Sharma', 'Dr. Meena', 'Dr. Patel', 'Dr. Kumar'],
                        datasets: [{
                            label: 'Appointments',
                            data: [42, 38, 35, 41],
                            backgroundColor: [
                                '#a8e6cf',
                                '#dcedf2',
                                '#e0c3fc',
                                'rgba(168, 230, 207, 0.7)'
                            ],
                            borderWidth: 0,
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating appointments chart:', error);
            }
        }
    }

    animateCounters() {
        const counters = [
            { id: 'total-users', target: 1247 },
            { id: 'chat-sessions', target: 3892 },
            { id: 'appointments', target: 156 },
            { id: 'resource-views', target: 2834 }
        ];
        
        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
                this.animateCounter(element, counter.target);
            }
        });
    }

    animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const start = performance.now();
        const initial = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(initial + (target - initial) * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    showSuccessMessage(message) {
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.classList.remove('hidden');
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 3000);
        } else {
            // Fallback to alert if modal is not available
            alert(message);
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.add('hidden'));
    }

    loadInitialData() {
        // Simulate loading some initial forum posts
        this.forumPosts = [
            {
                author: 'User847',
                content: 'Just wanted to share that meditation really helped me during finals week. Even 5 minutes made a difference! 🧘‍♀️',
                time: '2 hours ago',
                upvotes: 12
            },
            {
                author: 'User293',
                content: 'Feeling overwhelmed with assignments? Remember it\'s okay to ask for help. The counselors here are amazing and really understanding. 💚',
                time: '5 hours ago',
                upvotes: 8
            }
        ];
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Wellness Portal...');
    
    const app = new WellnessPortal();
    
    // Make app globally accessible for debugging
    window.wellnessApp = app;
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.card-3d, .feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add parallax effect to hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
    
    // Add floating animation keyframes to CSS via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .selected {
            background-color: #a8e6cf !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(168, 230, 207, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Wellness Portal initialized successfully!');
});
// ===== Enhanced Wellness: Circular Meditation Timer + Mood Tracker (with Custom minutes) =====
(function(){
  // Elements
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

  // audio bell
  const bell = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');

  // ring geometry
  const R = 52;
  const C = 2 * Math.PI * R;
  if (ring) {
    ring.style.strokeDasharray = `${C}`;
    ring.style.strokeDashoffset = `${C}`;
  }

  // timer state
  let totalSeconds = 60;
  let remaining = 60;
  let intervalId = null;
  let running = false;
  let paused = false;

  // Helper to read selected seconds (handles custom)
  function getSelectedSeconds(){
    if (!preset) return 60;
    const val = preset.value;
    if (val === 'custom') {
      const m = parseInt(customMinInput.value, 10);
      if (!m || m <= 0) return null; // invalid
      return m * 60;
    } else {
      return parseInt(val, 10) || 60;
    }
  }

  function secToMMSS(s){
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${m}:${sec}`;
  }

  function setProgressFromRemaining(){
    if (!ring || totalSeconds <= 0) return;
    const pct = Math.max(0, Math.min(1, (totalSeconds - remaining) / totalSeconds));
    const offset = C - (C * pct);
    ring.style.strokeDashoffset = offset;
  }

  function updateUI(){
    display.textContent = secToMMSS(remaining);
    if (running) label.textContent = 'Running';
    else if (paused) label.textContent = 'Paused';
    else label.textContent = 'Ready';
    setProgressFromRemaining();
  }

  function startTimer(){
    if (running) return;
    const secs = getSelectedSeconds();
    if (secs === null) {
      // invalid custom input
      alert('Custom time invalid — enter minutes (1-180).');
      customMinInput.focus();
      return;
    }
    // If timer was completed earlier, or not initialized, set new
    if (!paused && !running) {
      totalSeconds = secs;
      remaining = secs;
    } else if (!running && paused) {
      // resume with current remaining (paused)
      // nothing special
    }
    running = true; paused = false;
    btnStart.disabled = true; btnPause.disabled = false; btnStop.disabled = false;
    label.textContent = 'Running';
    intervalId = setInterval(()=>{
      remaining--;
      updateUI();
      if (remaining <= 0){
        clearInterval(intervalId);
        running = false; paused = false;
        btnStart.disabled = false; btnPause.disabled = true; btnStop.disabled = true;
        label.textContent = 'Done';
        setProgressFromRemaining();
        bell.play().catch(()=>{});
      }
    }, 1000);
  }

  function pauseTimer(){
    if (!running) return;
    clearInterval(intervalId);
    running = false; paused = true;
    btnStart.disabled = false; btnPause.disabled = true;
    label.textContent = 'Paused';
  }

  function stopTimer(){
    clearInterval(intervalId);
    running = false; paused = false;
    const secs = getSelectedSeconds();
    totalSeconds = (secs === null) ? parseInt(preset.value,10) || 60 : secs;
    remaining = totalSeconds;
    btnStart.disabled = false; btnPause.disabled = true; btnStop.disabled = true;
    label.textContent = 'Ready';
    updateUI();
  }

  // init values
  function initFromPreset(){
    const secs = getSelectedSeconds();
    if (secs === null) {
      // invalid custom — fallback to 60s
      totalSeconds = 60; remaining = 60;
    } else {
      totalSeconds = secs; remaining = secs;
    }
    updateUI();
  }

  // show/hide custom input based on select
  function handlePresetChange(){
    if (preset.value === 'custom') {
      customWrapper.style.display = 'flex';
      customMinInput.focus();
    } else {
      customWrapper.style.display = 'none';
      // reset custom input if you want:
      // customMinInput.value = '';
    }
    // update UI duration only if not running
    if (!running) {
      initFromPreset();
    }
  }

  // init
  preset?.addEventListener('change', handlePresetChange);
  customMinInput?.addEventListener('input', ()=> {
    // clamp values
    if (customMinInput.value) {
      let v = parseInt(customMinInput.value,10);
      if (v > 180) { v = 180; customMinInput.value = 180; }
      if (v < 1) { v = 1; customMinInput.value = 1; }
    }
    if (!running) initFromPreset();
  });

  // initial setup: hide custom if not selected
  if (preset && preset.value !== 'custom') {
    customWrapper.style.display = 'none';
  } else if (preset && preset.value === 'custom') {
    customWrapper.style.display = 'flex';
  }
  initFromPreset();

  // wire buttons
  btnStart?.addEventListener('click', startTimer);
  btnPause?.addEventListener('click', pauseTimer);
  btnStop?.addEventListener('click', stopTimer);

  // Mood buttons logic (unchanged)
  let selectedMood = null;
  moodBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      moodBtns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      selectedMood = b.dataset.mood;
    });
  });

  function saveMood(){
    const note = moodNote.value || '';
    if (!selectedMood){
      moodMsg.textContent = 'Pehle mood choose karo.';
      moodMsg.style.color = 'crimson';
      return;
    }
    const entry = { ts: new Date().toISOString(), mood: selectedMood, note };
    const key = 'sukoon_mood_logs';
    const cur = JSON.parse(localStorage.getItem(key) || '[]');
    cur.push(entry);
    localStorage.setItem(key, JSON.stringify(cur));
    moodMsg.textContent = 'Saved locally ✅';
    moodMsg.style.color = 'green';
    moodBtns.forEach(x=>x.classList.remove('active'));
    selectedMood = null;
    moodNote.value = '';
  }

  saveMoodBtn?.addEventListener('click', saveMood);

  function exportCSV(){
    const key = 'sukoon_mood_logs';
    const cur = JSON.parse(localStorage.getItem(key) || '[]');
    if (!cur.length){
      moodMsg.textContent = 'Koi saved mood nahi hai.';
      moodMsg.style.color = 'crimson';
      return;
    }
    const rows = [['timestamp','mood','note']];
    cur.forEach(r=> rows.push([r.ts, r.mood, (r.note || '').replace(/\n/g,' ') ]));
    const csv = rows.map(r=> r.map(c=> `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sukoon_mood_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  exportBtn?.addEventListener('click', exportCSV);
})();
// ========== BENEFITS ACCORDION ==========

document.querySelectorAll('.benefit-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('active');
  });
});

// ===== Enhanced Mood Tracker + History Chart (Chart.js) =====
(function(){
  // DOM
  const moodBtns = document.querySelectorAll('.mood-btn');
  const moodNote = document.getElementById('mood-note');
  const saveMoodBtn = document.getElementById('save-mood');
  const exportBtn = document.getElementById('export-mood');
  const moodMsg = document.getElementById('mood-msg');
  const CHART_CANVAS = document.getElementById('moodChart');

  if (!CHART_CANVAS) {
    console.warn('Mood chart canvas not found.');
    return;
  }

  // map moods to numeric
  const MOOD_SCORE = {
    'very_happy': 5,
    'happy': 4,
    'neutral': 3,
    'sad': 2,
    'very_sad': 1
  };

  // localStorage key
  const KEY = 'sukoon_mood_logs';

  // state
  let selectedMood = null;
  let moodChart = null;

  // helper: load logs (array of {ts, mood, note})
  function loadLogs(){
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  // helper: save logs
  function saveLogs(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  // UI: mood button selection
  moodBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      moodBtns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      selectedMood = b.dataset.mood;
      b.setAttribute('aria-checked','true');
      // small hint cleared
      moodMsg.textContent = '';
    });
  });

  // Save mood
  function saveMood(){
    if (!selectedMood){
      moodMsg.style.color = 'crimson';
      moodMsg.textContent = 'Pehle mood choose karo.';
      return;
    }
    const note = moodNote.value?.trim() || '';
    const entry = { ts: new Date().toISOString(), mood: selectedMood, note };
    const cur = loadLogs();
    cur.push(entry);
    saveLogs(cur);

    // UI feedback
    moodMsg.style.color = 'green';
    moodMsg.textContent = 'Saved ✅';
    // reset selection & note
    moodBtns.forEach(x=>x.classList.remove('active'));
    selectedMood = null;
    moodNote.value = '';

    // update chart
    updateChart();
    // small auto-clear
    setTimeout(()=> moodMsg.textContent = '', 2500);
  }

  saveMoodBtn?.addEventListener('click', saveMood);

  // Export CSV
  function exportCSV(){
    const cur = loadLogs();
    if (!cur.length){
      moodMsg.style.color = 'crimson';
      moodMsg.textContent = 'Koi saved mood nahi hai.';
      return;
    }
    const rows = [['timestamp','mood','note']];
    cur.forEach(r => rows.push([r.ts, r.mood, (r.note||'').replace(/\n/g,' ') ]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sukoon_mood_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    moodMsg.style.color = 'green';
    moodMsg.textContent = 'Exported CSV ✅';
    setTimeout(()=> moodMsg.textContent = '', 2000);
  }

  exportBtn?.addEventListener('click', exportCSV);

  // Build last N days labels
  function getLastNDates(n){
    const res = [];
    const now = new Date();
    for (let i = n-1; i >= 0; i--){
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      res.push(d);
    }
    return res;
  }

  // Aggregate logs into daily average mood for last N days
  function aggregateDailyAverage(days = 14){
    const logs = loadLogs();
    const dates = getLastNDates(days);
    const labels = dates.map(d => {
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
      return `${dd}/${mm}`;
    });

    // prepare buckets
    const sums = new Array(days).fill(0);
    const counts = new Array(days).fill(0);

    logs.forEach(e => {
      const t = new Date(e.ts);
      // find index among last N days
      for (let i = 0; i < dates.length; i++){
        const d = dates[i];
        if (t.getFullYear() === d.getFullYear() && t.getMonth() === d.getMonth() && t.getDate() === d.getDate()){
          const score = MOOD_SCORE[e.mood] || 3;
          sums[i] += score;
          counts[i] += 1;
          break;
        }
      }
    });

    const avg = sums.map((s,i) => counts[i] ? +(s/counts[i]).toFixed(2) : null);
    return { labels, avg, counts };
  }

  // Draw or update Chart.js line chart
  // ===== Better Chart.js: init/update mood history chart =====
function createMoodChart() {
  const canvas = document.getElementById('moodChart');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  // create gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, 'rgba(43,108,176,0.18)');
  grad.addColorStop(1, 'rgba(43,108,176,0.02)');

  const cfg = {
    type: 'line',
    data: { labels: [], datasets: [{
      label: 'Avg mood (5=best)',
      data: [],
      tension: 0.32,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderColor: '#2b6cb0',
      backgroundColor: grad,
      fill: true,
      spanGaps: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#2b6cb0',
      pointBorderWidth: 2
    }]},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(ctx) {
              const v = ctx.parsed.y;
              return v ? `Average: ${v}` : 'No data';
            }
          }
        }
      },
      scales: {
        y: {
          suggestedMin: 1,
          suggestedMax: 5,
          ticks: { stepSize: 1, color: '#475569', font: {size:12} },
          grid: { color: 'rgba(15,23,42,0.04)' },
          title: { display: true, text: 'Mood (1–5)', color:'#64748b', font:{size:12} }
        },
        x: {
          ticks: { color: '#475569', font:{size:12} },
          grid: { display: false }
        }
      }
    }
  };

  // destroy existing chart instance if present
  if (window._sukoonMoodChart instanceof Chart) {
    try { window._sukoonMoodChart.destroy(); } catch(e){}
    window._sukoonMoodChart = null;
  }

  window._sukoonMoodChart = new Chart(ctx, cfg);
  return window._sukoonMoodChart;
}

function updateMoodChartData() {
  // uses same aggregateDailyAverage(days) helper from earlier code
  const days = 14;
  const { labels, avg } = aggregateDailyAverage(days); // assume this exists
  let chart = window._sukoonMoodChart || createMoodChart();
  if (!chart) return;

  // replace nulls with NaN so Chart.js will show gap (nice)
  const data = avg.map(v => (v === null ? NaN : v));
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // create chart instance and render initial data
  createMoodChart();
  updateMoodChartData();
});


  // init on load

  // Optional: refresh chart every time user navigates to wellness page
  // If you have page navigation code, call updateChart() when wellness opened.

})();


