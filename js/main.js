// Global Variables
let userBalance = 10000;
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
let balanceElement;
let gameCards;
let playButtons;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements after page load
    balanceElement = document.getElementById('userBalance');
    gameCards = document.querySelectorAll('.game-card');
    playButtons = document.querySelectorAll('.play-btn');
    
    initializeApp();
    setupEventListeners();
    startAnimations();
});

// Initialize Application
function initializeApp() {
    checkAuthStatus();
    loadUserData();
    // updateBalance() is called by loadUserData() or checkAuthStatus()
}

// Setup Event Listeners
function setupEventListeners() {
    // Game card click events
    gameCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the play button
            if (!e.target.closest('.play-btn')) {
                const gameName = card.dataset.game;
                showGamePreview(gameName);
            }
        });

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Play button click events
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameCard = e.target.closest('.game-card');
            const gameName = gameCard.dataset.game;
            startGame(gameName);
        });
    });

    // Navigation smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // User avatar click
    document.querySelector('.user-avatar').addEventListener('click', () => {
        showUserProfile();
    });

    // Balance click to add funds
    document.querySelector('.balance').addEventListener('click', () => {
        showDepositModal();
    });
}

// Update Balance Display
function updateBalance() {
    if (balanceElement) {
        // Animate balance change
        const currentBalance = parseInt(balanceElement.textContent.replace(/,/g, ''));
        animateValue(balanceElement, currentBalance, userBalance, 500);
    }
}

// Animate number value
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('vi-VN');
    }, 16);
}

// Show Game Preview
function showGamePreview(gameName) {
    const gameInfo = getGameInfo(gameName);
    
    // Create preview overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-preview-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    const previewCard = document.createElement('div');
    previewCard.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        animation: slideIn 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    previewCard.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">${gameInfo.icon}</div>
        <h2 style="font-size: 32px; margin-bottom: 15px; color: #FFD700;">${gameInfo.name}</h2>
        <p style="font-size: 16px; margin-bottom: 20px; opacity: 0.9;">${gameInfo.description}</p>
        <div style="display: flex; justify-content: space-around; margin-bottom: 30px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
            <div>
                <div style="font-size: 24px; font-weight: bold; color: #FFD700;">${gameInfo.minBet}</div>
                <div style="font-size: 12px; opacity: 0.8;">Cược Tối Thiểu</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold; color: #FFD700;">${gameInfo.maxWin}</div>
                <div style="font-size: 12px; opacity: 0.8;">Thắng Tối Đa</div>
            </div>
        </div>
        <button onclick="startGameFromPreview('${gameName}')" style="
            background: #FFD700;
            color: #000;
            border: none;
            padding: 15px 40px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            🎮 Chơi Ngay
        </button>
        <button onclick="closePreview()" style="
            background: transparent;
            color: #fff;
            border: 2px solid #fff;
            padding: 15px 40px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
            Đóng
        </button>
    `;

    overlay.appendChild(previewCard);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePreview();
        }
    });
}

// Get Game Information
function getGameInfo(gameName) {
    const games = {
        taixiu: {
            name: 'Tài Xỉu',
            icon: '🎲',
            description: 'Đoán kết quả tổng của 3 xúc xắc. Từ 4-10 là Xỉu, 11-17 là Tài.',
            minBet: '100đ',
            maxWin: 'x2'
        },
        xocdia: {
            name: 'Xóc Đĩa',
            icon: '🔴',
            description: 'Trò chơi dân gian truyền thống. Đoán số lượng hột đỏ/trắng.',
            minBet: '100đ',
            maxWin: 'x3'
        },
        bongda: {
            name: 'Bóng Đá',
            icon: '⚽',
            description: 'Cá cược trận đấu với các cửa 1X2, tài xỉu và tỷ số.',
            minBet: '200đ',
            maxWin: 'x12'
        },
        roulette: {
            name: 'Roulette',
            icon: '🎡',
            description: 'Vòng quay may mắn kinh điển. Đặt cược vào số, màu hoặc nhóm.',
            minBet: '200đ',
            maxWin: 'x36'
        },
        slot: {
            name: 'Slot Machine',
            icon: '🎰',
            description: 'Máy đánh bạc 777. Quay và khớp các biểu tượng để thắng lớn!',
            minBet: '50đ',
            maxWin: 'x1000'
        },
        baucua: {
            name: 'Bầu Cua',
            icon: '🦀',
            description: 'Bầu Cua Cá Cọp - game truyền thống Tết. 6 con vật may mắn.',
            minBet: '100đ',
            maxWin: 'x3'
        },
        blackjack: {
            name: 'Blackjack',
            icon: '🃏',
            description: 'Xì Dách - cố gắng đạt 21 điểm mà không bị quá.',
            minBet: '500đ',
            maxWin: 'x2.5'
        },
        poker: {
            name: 'Poker',
            icon: '♠️',
            description: 'Texas Hold\'em Poker. Tạo bộ bài mạnh nhất để thắng.',
            minBet: '1000đ',
            maxWin: 'x100'
        },
        baccarat: {
            name: 'Baccarat',
            icon: '💎',
            description: 'Bài Cào cao cấp. Đặt cược vào Player hoặc Banker.',
            minBet: '500đ',
            maxWin: 'x2'
        }
    };

    return games[gameName] || games.taixiu;
}

// Start Game
function startGame(gameName) {
    console.log(`Starting game: ${gameName}`);
    
    // Check if user is logged in
    if (!isLoggedIn) {
        showNotification('Vui lòng đăng nhập để chơi game! 🔐', 'error');
        setTimeout(() => {
            showAuthModal('login');
        }, 1000);
        return;
    }
    
    // Navigate to game page
    const gamePages = {
        'taixiu': 'html/game/taixiu.html',
        'xocdia': 'html/game/xocdia.html',
        'bongda': 'html/game/bongda.html',
        'roulette': 'html/game/roulette.html',
        'slot': 'html/game/slot.html',
        'baucua': 'html/game/baucua.html',
        'blackjack': 'html/game/blackjack.html',
        'poker': 'html/game/poker.html',
        'baccarat': 'html/game/baccarat.html'
    };
    
    if (gamePages[gameName]) {
        window.location.href = gamePages[gameName];
    } else {
        // Show loading animation for games not yet implemented
        showLoadingScreen(gameName);

        // Simulate game loading
        setTimeout(() => {
            hideLoadingScreen();
            showGameNotification(gameName);
        }, 2000);
    }
}

// Start Game from Preview
window.startGameFromPreview = function(gameName) {
    closePreview();
    startGame(gameName);
};

// Close Preview
window.closePreview = function() {
    const overlay = document.querySelector('.game-preview-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
};

// Show Loading Screen
function showLoadingScreen(gameName) {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    loadingScreen.innerHTML = `
        <div class="spinner" style="
            border: 8px solid rgba(255, 255, 255, 0.3);
            border-top: 8px solid #FFD700;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            animation: spin 1s linear infinite;
        "></div>
        <h2 style="margin-top: 30px; font-size: 28px; color: #FFD700;">Đang tải game...</h2>
        <p style="margin-top: 10px; opacity: 0.9;">${getGameInfo(gameName).name}</p>
    `;

    document.body.appendChild(loadingScreen);

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Hide Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => loadingScreen.remove(), 300);
    }
}

// Show Game Notification
function showGameNotification(gameName) {
    const gameInfo = getGameInfo(gameName);
    showNotification(`Game ${gameInfo.name} sẽ được phát triển sớm! 🎮`, 'info');
}

// Show Notification
// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    let bgColor;
    if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #e94560 0%, #c1351d 100%)';
    } else {
        bgColor = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
        font-size: 16px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Show Welcome Message
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Chào mừng bạn đến với Lucky Casino! 🎰', 'success');
    }, 500);
}

// Show User Profile
function showUserProfile() {
    showNotification('Tính năng hồ sơ người dùng đang phát triển! 👤', 'info');
}

// Show Deposit Modal
function showDepositModal() {
    showNotification('Tính năng nạp tiền đang phát triển! 💰', 'info');
}

// Load User Data
function loadUserData() {
    // Load balance from currentUser if available (primary source)
    if (currentUser && currentUser.balance !== undefined) {
        userBalance = currentUser.balance;
        updateBalance();
    } else {
        // Fallback to old userBalance key (for backward compatibility)
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
            userBalance = parseInt(savedBalance);
            updateBalance();
        }
    }
}

// Save User Data
function saveUserData() {
    // Deprecated: balance is now saved in currentUser object
    // Kept for backward compatibility only
    localStorage.setItem('userBalance', userBalance.toString());
}

// Start Animations
function startAnimations() {
    // Random player count updates
    setInterval(() => {
        document.querySelectorAll('.players').forEach(elem => {
            const currentCount = parseInt(elem.textContent.trim());
            const change = Math.floor(Math.random() * 10) - 5;
            const newCount = Math.max(50, currentCount + change);
            elem.innerHTML = `<i class="fas fa-users"></i> ${newCount}`;
        });
    }, 5000);

    // Balance pulse effect on wins (simulated)
    setInterval(() => {
        if (Math.random() > 0.7) {
            const balanceElem = document.querySelector('.balance');
            balanceElem.style.animation = 'none';
            setTimeout(() => {
                balanceElem.style.animation = 'glow 2s ease-in-out infinite';
            }, 10);
        }
    }, 10000);
}

// Smooth scroll reveal
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.game-card, .promo-card');
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Prevent right click on production (optional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Auto-save user data
setInterval(saveUserData, 30000);

// ========================================
// AUTHENTICATION SYSTEM
// ========================================

// Check Authentication Status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    
    // Load user data if exists (regardless of rememberMe)
    // rememberMe only affects whether to persist across browser sessions
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        showLoggedInState();
        showWelcomeMessage();
    } else {
        isLoggedIn = false;
        showLoggedOutState();
    }
}

// Show Logged In State
function showLoggedInState() {
    const authButtons = document.getElementById('authButtons');
    const userLoggedIn = document.getElementById('userLoggedIn');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userLoggedIn) userLoggedIn.style.display = 'flex';
    
    // Update user name
    const userName = document.getElementById('userName');
    const userMenuName = document.getElementById('userMenuName');
    
    if (currentUser) {
        if (userName) {
            userName.textContent = currentUser.username;
            userName.setAttribute('title', currentUser.username); // Show full name on hover
        }
        if (userMenuName) userMenuName.textContent = currentUser.username;
        
        // Update balance
        userBalance = currentUser.balance || 10000;
        updateBalance();
    }
}

// Show Logged Out State
function showLoggedOutState() {
    const authButtons = document.getElementById('authButtons');
    const userLoggedIn = document.getElementById('userLoggedIn');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userLoggedIn) userLoggedIn.style.display = 'none';
}

// Show Auth Modal
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        switchAuthMode(mode);
        document.body.style.overflow = 'hidden';
    }
}

// Close Auth Modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset forms
        document.getElementById('loginForm').querySelector('form').reset();
        document.getElementById('registerForm').querySelector('form').reset();
    }
}

// Switch Auth Mode
function switchAuthMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        // Login successful
        currentUser = {
            username: user.username,
            email: user.email,
            phone: user.phone,
            balance: user.balance || 10000,
            loginTime: new Date().toISOString()
        };
        
        isLoggedIn = true;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        // Update UI
        showLoggedInState();
        closeAuthModal();
        
        // Show success notification
        showNotification(`Chào mừng trở lại, ${currentUser.username}! 🎉`, 'success');
        
        // Add login bonus (first time today)
        checkDailyBonus();
        
        // Add demo transactions if first time
        addDemoTransactions();
    } else {
        // Login failed
        showNotification('Sai tên đăng nhập hoặc mật khẩu! ❌', 'error');
        
        // Shake animation for form
        const form = event.target;
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
    
    return false;
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const ageConfirm = document.getElementById('ageConfirm').checked;
    
    // Validation
    if (!agreeTerms || !ageConfirm) {
        showNotification('Vui lòng đồng ý với điều khoản! ⚠️', 'error');
        return false;
    }
    
    if (password !== passwordConfirm) {
        showNotification('Mật khẩu xác nhận không khớp! ❌', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự! ❌', 'error');
        return false;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username or email exists
    if (users.some(u => u.username === username)) {
        showNotification('Tên đăng nhập đã tồn tại! ❌', 'error');
        return false;
    }
    
    if (users.some(u => u.email === email)) {
        showNotification('Email đã được đăng ký! ❌', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        phone,
        password, // In production, this should be hashed!
        balance: 15000, // Welcome bonus
        registeredDate: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    currentUser = {
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        balance: newUser.balance,
        loginTime: new Date().toISOString()
    };
    
    isLoggedIn = true;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('rememberMe', 'true');
    
    // Update UI
    showLoggedInState();
    closeAuthModal();
    
    // Show success notification
    showNotification(`Đăng ký thành công! Chào mừng ${username}! Bạn nhận được 15,000đ thưởng! 🎁`, 'success');
    
    // Add welcome bonus transaction
    addDemoTransactions();
    
    return false;
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password Strength Checker
document.addEventListener('DOMContentLoaded', () => {
    const registerPassword = document.getElementById('registerPassword');
    
    if (registerPassword) {
        registerPassword.addEventListener('input', (e) => {
            const password = e.target.value;
            const strengthBar = document.querySelector('.strength-bar');
            
            if (!strengthBar) return;
            
            let strength = 0;
            
            if (password.length >= 6) strength++;
            if (password.length >= 10) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z\d]/.test(password)) strength++;
            
            // Remove all classes
            strengthBar.classList.remove('weak', 'medium', 'strong');
            
            if (strength <= 2) {
                strengthBar.classList.add('weak');
            } else if (strength <= 4) {
                strengthBar.classList.add('medium');
            } else {
                strengthBar.classList.add('strong');
            }
        });
    }
});

// Toggle User Menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userMenu && !userMenu.contains(e.target) && !userAvatar?.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});

// Logout
function logout() {
    // Clear current user but keep users data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    currentUser = null;
    isLoggedIn = false;
    
    // Update UI
    showLoggedOutState();
    
    // Close user menu
    const userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.classList.remove('active');
    
    // Show notification
    showNotification('Đã đăng xuất thành công! Hẹn gặp lại! 👋', 'success');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show Profile
function showProfile() {
    if (!isLoggedIn) {
        showAuthModal('login');
        return;
    }
    
    showNotification('Tính năng hồ sơ đang phát triển! 👤', 'info');
    toggleUserMenu();
}

// Show Settings
function showSettings() {
    if (!isLoggedIn) {
        showAuthModal('login');
        return;
    }
    
    showNotification('Cài đặt đang phát triển! ⚙️', 'info');
    toggleUserMenu();
}

// Check Daily Bonus
function checkDailyBonus() {
    const lastBonus = localStorage.getItem('lastDailyBonus');
    const today = new Date().toDateString();
    
    if (lastBonus !== today) {
        // Give daily bonus
        const bonusAmount = 500;
        currentUser.balance += bonusAmount;
        userBalance = currentUser.balance;
        
        // Update storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].balance = currentUser.balance;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('lastDailyBonus', today);
        
        updateBalance();
        
        setTimeout(() => {
            showNotification(`Bạn nhận được ${bonusAmount}đ thưởng đăng nhập hàng ngày! 🎁`, 'success');
        }, 1500);
    }
}

// Update Show Welcome Message
function showWelcomeMessage() {
    if (isLoggedIn && currentUser) {
        setTimeout(() => {
            showNotification(`Chào mừng trở lại, ${currentUser.username}! 🎰`, 'success');
        }, 500);
    }
}

// Override Show Deposit Modal
function showDepositModal() {
    if (!isLoggedIn) {
        showAuthModal('login');
        return;
    }
    
    // Close user menu if open
    const userMenu = document.getElementById('userMenu');
    if (userMenu && userMenu.classList.contains('active')) {
        userMenu.classList.remove('active');
    }
    
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset to methods view
        document.querySelector('.deposit-methods').style.display = 'grid';
        document.getElementById('depositForm').style.display = 'none';
        
        // Update user code
        if (currentUser) {
            const userCode = currentUser.username.substring(0, 5).toUpperCase();
            document.getElementById('userCode').textContent = userCode;
            document.getElementById('userCodeMomo').textContent = userCode;
            document.getElementById('userCodeZalo').textContent = userCode;
        }
    }
}

// Close Deposit Modal
function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Select Deposit Method
function selectDepositMethod(method) {
    // Hide methods, show form
    document.querySelector('.deposit-methods').style.display = 'none';
    document.getElementById('depositForm').style.display = 'block';
    
    // Hide all payment methods
    document.querySelectorAll('.payment-method').forEach(m => m.style.display = 'none');
    
    // Show selected method
    switch(method) {
        case 'bank':
            document.getElementById('bankMethod').style.display = 'block';
            break;
        case 'momo':
            document.getElementById('momoMethod').style.display = 'block';
            break;
        case 'zalopay':
            document.getElementById('zalopayMethod').style.display = 'block';
            break;
        case 'card':
            document.getElementById('cardMethod').style.display = 'block';
            break;
    }
}

// Back to Methods
function backToMethods() {
    document.querySelector('.deposit-methods').style.display = 'grid';
    document.getElementById('depositForm').style.display = 'none';
}

// Copy Text
function copyText(element) {
    const text = element.textContent.trim().replace(' ', '').replace(/\s+/g, ' ');
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show notification
    showNotification('Đã sao chép! 📋', 'success');
    
    // Visual feedback
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// Set Amount
function setAmount(amount, method = 'bank') {
    const inputId = method === 'momo' ? 'momoAmount' : 
                    method === 'zalopay' ? 'zalopayAmount' : 'bankAmount';
    const input = document.getElementById(inputId);
    if (input) {
        input.value = amount;
    }
}

// Confirm Deposit
function confirmDeposit(method) {
    let amount = 0;
    let methodName = '';
    
    switch(method) {
        case 'bank':
            amount = parseInt(document.getElementById('bankAmount').value) || 0;
            methodName = 'Chuyển khoản ngân hàng';
            break;
        case 'momo':
            amount = parseInt(document.getElementById('momoAmount').value) || 0;
            methodName = 'Ví MoMo';
            break;
        case 'zalopay':
            amount = parseInt(document.getElementById('zalopayAmount').value) || 0;
            methodName = 'ZaloPay';
            break;
        case 'card':
            const cardCode = document.getElementById('cardCode').value;
            const cardSerial = document.getElementById('cardSerial').value;
            amount = parseInt(document.getElementById('cardValue').value) || 0;
            methodName = 'Thẻ cào';
            
            if (!cardCode || !cardSerial) {
                showNotification('Vui lòng nhập đầy đủ thông tin thẻ! ❌', 'error');
                return;
            }
            
            // Apply card fee (80%)
            amount = Math.floor(amount * 0.8);
            break;
    }
    
    if (amount < 10000) {
        showNotification('Số tiền nạp tối thiểu 10,000đ! ⚠️', 'error');
        return;
    }
    
    // Add to history
    addTransaction({
        type: 'deposit',
        method: methodName,
        amount: amount,
        status: 'pending',
        date: new Date().toISOString()
    });
    
    // Close modal
    closeDepositModal();
    
    // Show notification
    showNotification(`Yêu cầu nạp ${amount.toLocaleString('vi-VN')}đ qua ${methodName} đang được xử lý! ⏳`, 'info');
    
    // Simulate auto approval after 3 seconds
    setTimeout(() => {
        approveDeposit(amount);
    }, 3000);
}

// Approve Deposit (Simulated)
function approveDeposit(amount) {
    // Update balance
    currentUser.balance = (currentUser.balance || 0) + amount;
    userBalance = currentUser.balance;
    
    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].balance = currentUser.balance;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update last transaction status
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    if (history.length > 0) {
        history[history.length - 1].status = 'success';
        localStorage.setItem('transactionHistory', JSON.stringify(history));
    }
    
    // Update UI
    updateBalance();
    
    // Show notification
    showNotification(`Nạp ${amount.toLocaleString('vi-VN')}đ thành công! 🎉`, 'success');
}

// ========================================
// HISTORY SYSTEM
// ========================================

// Show History Modal
function showHistory() {
    if (!isLoggedIn) {
        showAuthModal('login');
        return;
    }
    
    toggleUserMenu(); // Close user menu
    
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadHistory('all');
    }
}

// Close History Modal
function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Add Transaction to History
function addTransaction(transaction) {
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    
    // Add user info
    transaction.username = currentUser.username;
    transaction.id = Date.now().toString();
    
    history.push(transaction);
    localStorage.setItem('transactionHistory', JSON.stringify(history));
}

// Load History
function loadHistory(filter = 'all') {
    const allHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    
    // Filter by current user
    let userHistory = allHistory.filter(t => t.username === currentUser.username);
    
    // Apply filter
    if (filter !== 'all') {
        userHistory = userHistory.filter(t => t.type === filter);
    }
    
    // Sort by date (newest first)
    userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update UI
    const historyList = document.getElementById('historyList');
    
    if (userHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>Chưa có giao dịch nào</p>
            </div>
        `;
    } else {
        historyList.innerHTML = userHistory.map(transaction => {
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let icon = '';
            let title = '';
            let amountClass = '';
            let sign = '';
            
            switch(transaction.type) {
                case 'deposit':
                    icon = 'fas fa-arrow-down';
                    title = `Nạp tiền - ${transaction.method}`;
                    amountClass = 'positive';
                    sign = '+';
                    break;
                case 'game':
                    icon = 'fas fa-gamepad';
                    title = `Chơi game - ${transaction.game || 'Game'}`;
                    amountClass = transaction.amount > 0 ? 'positive' : 'negative';
                    sign = transaction.amount > 0 ? '+' : '';
                    break;
                case 'bonus':
                    icon = 'fas fa-gift';
                    title = transaction.method || 'Thưởng';
                    amountClass = 'positive';
                    sign = '+';
                    break;
                case 'withdraw':
                    icon = 'fas fa-arrow-up';
                    title = 'Rút tiền';
                    amountClass = 'negative';
                    sign = '-';
                    break;
            }
            
            return `
                <div class="history-item">
                    <div class="history-item-left">
                        <div class="history-icon ${transaction.type}">
                            <i class="${icon}"></i>
                        </div>
                        <div class="history-details">
                            <h4>${title}</h4>
                            <p>${formattedDate}</p>
                        </div>
                    </div>
                    <div class="history-item-right">
                        <div class="history-amount ${amountClass}">
                            ${sign}${Math.abs(transaction.amount).toLocaleString('vi-VN')}đ
                        </div>
                        <span class="history-status ${transaction.status}">
                            ${transaction.status === 'success' ? 'Thành công' : 
                              transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Filter History
function filterHistory(type) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    // Load filtered history
    loadHistory(type);
}

// Pagination (for future implementation)
let currentPage = 1;
let itemsPerPage = 10;

function nextPage() {
    currentPage++;
    loadHistory();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadHistory();
    }
}

// Add some demo transactions on first login
function addDemoTransactions() {
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    
    // Check if user already has transactions
    const userTransactions = history.filter(t => t.username === currentUser.username);
    if (userTransactions.length === 0) {
        // Add welcome bonus transaction
        addTransaction({
            type: 'bonus',
            method: 'Thưởng chào mừng',
            amount: 15000,
            status: 'success',
            date: new Date().toISOString()
        });
    }
}

// Add shake animation style
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Console welcome message
console.log('%c🎰 Lucky Casino', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%cChào mừng đến với Lucky Casino! Vui chơi có trách nhiệm.', 'font-size: 14px; color: #667eea;');
console.log('%c⚠️ Đây là sòng bài giả - chỉ để giải trí', 'font-size: 12px; color: #e94560;');
