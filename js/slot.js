// Slot Machine Game Logic

// Symbols configuration
const SYMBOLS = [
    { icon: '🍒', name: 'Cherry', value: 2 },
    { icon: '🍋', name: 'Lemon', value: 3 },
    { icon: '🍊', name: 'Orange', value: 4 },
    { icon: '🍉', name: 'Watermelon', value: 5 },
    { icon: '🍇', name: 'Grape', value: 6 },
    { icon: '🔔', name: 'Bell', value: 10 },
    { icon: '💎', name: 'Diamond', value: 20 },
    { icon: '7️⃣', name: 'Seven', value: 50 }
];

// Game state - use separate variable name to avoid conflict with main.js
let slotCurrentUser = null;
let currentBet = 1000;
let isSpinning = false;
let totalWins = 0;
let totalSpins = 0;

// DOM Elements
let reelElements = [];
let betInput, spinBtn, balanceDisplay, winsDisplay, spinsDisplay;
let winDisplay, winMessage, winAmount;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

// Initialize game elements
function initializeGame() {
    // Load user data
    slotCurrentUser = loadUser();
    if (!slotCurrentUser) {
        // Create demo user if not logged in
        slotCurrentUser = {
            username: 'Guest',
            balance: 100000
        };
        localStorage.setItem('currentUser', JSON.stringify(slotCurrentUser));
    }
    
    // Get DOM elements
    reelElements = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    
    betInput = document.getElementById('betAmount');
    spinBtn = document.getElementById('spinBtn');
    balanceDisplay = document.getElementById('userBalance');
    const balanceDisplay2 = document.getElementById('userBalance2');
    winsDisplay = document.getElementById('totalWins');
    spinsDisplay = document.getElementById('totalSpins');
    winDisplay = document.getElementById('winDisplay');
    winMessage = document.getElementById('winMessage');
    winAmount = document.getElementById('winAmount');

    // Initialize reels
    initializeReels();

    // Update UI
    updateBalanceUI();
    
    // Update second balance display
    if (balanceDisplay2) {
        balanceDisplay2.textContent = formatMoney(slotCurrentUser.balance);
    }
    
    updateStats();
}


// Setup event listeners
function setupEventListeners() {
    // Check if elements exist
    if (!spinBtn) {
        console.error('Spin button not found!');
        return;
    }
    
    if (!betInput) {
        console.error('Bet input not found!');
        return;
    }
    
    console.log('Setting up event listeners...');
    
    // Spin button
    spinBtn.addEventListener('click', () => {
        console.log('Spin button clicked!');
        handleSpin();
    });

    // Quick bet buttons
    document.querySelectorAll('.quick-bet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            console.log('Quick bet clicked:', action);
            handleQuickBet(action);
        });
    });

    // Bet input validation
    betInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value < 100) value = 100;
        if (value > slotCurrentUser.balance) value = slotCurrentUser.balance;
        e.target.value = value;
        currentBet = value;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isSpinning) {
            e.preventDefault();
            handleSpin();
        }
    });
    
    console.log('Event listeners setup complete!');
}

// Initialize reels with random symbols
function initializeReels() {
    console.log('Initializing reels...');
    
    reelElements.forEach((reel, index) => {
        if (!reel) {
            console.error(`Reel ${index + 1} not found!`);
            return;
        }
        
        const stripe = reel.querySelector('.reel-stripe');
        if (!stripe) {
            console.error(`Reel stripe ${index + 1} not found!`);
            return;
        }
        
        stripe.innerHTML = '';
        
        // Create 20 symbols for smooth scrolling
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = symbol.icon;
            symbolDiv.dataset.value = symbol.value;
            stripe.appendChild(symbolDiv);
        }
        
        console.log(`Reel ${index + 1} initialized with ${stripe.children.length} symbols`);
    });
    
    console.log('All reels initialized!');
}

// Handle quick bet buttons
function handleQuickBet(action) {
    if (isSpinning) return;

    switch (action) {
        case 'min':
            currentBet = 100;
            break;
        case 'x2':
            currentBet = Math.min(currentBet * 2, slotCurrentUser.balance);
            break;
        case 'half':
            currentBet = Math.max(Math.floor(currentBet / 2), 100);
            break;
        case 'max':
            currentBet = Math.min(10000, slotCurrentUser.balance);
            break;
        default:
            const amount = parseInt(action);
            if (amount) {
                currentBet = Math.min(amount, slotCurrentUser.balance);
            }
    }

    betInput.value = currentBet;
}

// Handle spin
async function handleSpin() {
    console.log('=== handleSpin called ===');
    console.log('isSpinning:', isSpinning);
    
    if (isSpinning) {
        console.log('Already spinning, returning...');
        return;
    }

    // Validate bet
    currentBet = parseInt(betInput.value) || 1000;
    console.log('Current bet:', currentBet);
    console.log('Current balance:', slotCurrentUser.balance);
    
    if (currentBet < 100) {
        showNotification('Cược tối thiểu là 100₫!', 'error');
        currentBet = 100;
        betInput.value = 100;
        return;
    }

    if (currentBet > slotCurrentUser.balance) {
        showNotification('Số dư không đủ! Vui lòng nạp thêm tiền.', 'error');
        return;
    }

    // Deduct bet amount
    slotCurrentUser.balance -= currentBet;
    persistUserBalance();
    updateBalanceUI();
    console.log('Balance after bet:', slotCurrentUser.balance);
    
    // Hide previous win display
    if (winDisplay) {
        winDisplay.classList.remove('show');
    }

    // Start spinning
    isSpinning = true;
    spinBtn.disabled = true;
    betInput.disabled = true;
    document.querySelectorAll('.quick-bet-btn').forEach(btn => btn.disabled = true);

    console.log('Starting spin animation...');
    
    // Spin animation
    reelElements.forEach((reel, index) => {
        console.log(`Adding spinning class to reel ${index + 1}`);
        reel.classList.add('spinning');
    });

    // Random spin duration for each reel
    const spinDurations = [2000, 2500, 3000];
    const results = [];

    for (let i = 0; i < reelElements.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                console.log(`Stopping reel ${i + 1}...`);
                const result = stopReel(reelElements[i], i);
                console.log(`Reel ${i + 1} result:`, result);
                results.push(result);
                resolve();
            }, spinDurations[i]);
        });
    }

    console.log('All reels stopped. Results:', results);

    // Calculate win
    const winData = calculateWin(results);
    console.log('Win data:', winData);
    
    totalSpins++;
    updateStats();

    if (winData.amount > 0) {
        // Player wins
        slotCurrentUser.balance += winData.amount;
        totalWins += winData.amount;
        persistUserBalance();
        updateBalanceUI();
        updateStats();

        // Show win display
        displayWin(winData);

        // Add transaction
        addTransaction({
            type: 'win',
            game: 'Slot Machine',
            amount: winData.amount - currentBet,
            time: new Date().toISOString(),
            details: `${winData.message} - Cược: ${formatMoney(currentBet)}`
        });

        // Highlight winning symbols
        highlightWinningLine();
    } else {
        // Player loses
        showNotification('Chúc bạn may mắn lần sau! 🎰', 'info');

        // Add transaction
        addTransaction({
            type: 'loss',
            game: 'Slot Machine',
            amount: currentBet,
            time: new Date().toISOString(),
            details: `Thua - Cược: ${formatMoney(currentBet)}`
        });
    }

    // Re-enable controls
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        betInput.disabled = false;
        document.querySelectorAll('.quick-bet-btn').forEach(btn => btn.disabled = false);
        
        // Remove winning highlights
        document.querySelectorAll('.symbol.winning').forEach(sym => {
            sym.classList.remove('winning');
        });
        const winLine = document.querySelector('.win-line');
        if (winLine) {
            winLine.classList.remove('active');
        }
        
        console.log('=== Spin complete ===');
    }, 3000);
}

// Stop reel at random position
function stopReel(reel, reelIndex) {
    reel.classList.remove('spinning');
    
    const stripe = reel.querySelector('.reel-stripe');
    const symbols = stripe.querySelectorAll('.symbol');
    
    // Pick a random symbol (middle position - index 1 in visible area means position 160px)
    const randomIndex = Math.floor(Math.random() * (symbols.length - 2));
    const selectedSymbol = symbols[randomIndex + 1]; // +1 to get middle symbol
    
    // Position the stripe so selected symbol is in the middle (160px from top)
    const symbolHeight = window.innerWidth <= 768 ? (window.innerWidth <= 480 ? 80 : 100) : 160;
    const offsetTop = -(randomIndex * symbolHeight);
    stripe.style.top = `${offsetTop}px`;
    
    return {
        icon: selectedSymbol.textContent,
        value: parseInt(selectedSymbol.dataset.value)
    };
}

// Calculate win amount
function calculateWin(results) {
    const [first, second, third] = results;

    // Check for three of a kind (Jackpot!)
    if (first.icon === second.icon && second.icon === third.icon) {
        const multiplier = first.value;
        const winAmount = currentBet * multiplier;
        
        let message = '';
        if (first.icon === '7️⃣') {
            message = '🎊 JACKPOT KHỦNG! 777! 🎊';
        } else if (first.icon === '💎') {
            message = '💎 TRIPLE DIAMONDS! 💎';
        } else if (first.icon === '🔔') {
            message = '🔔 TRIPLE BELLS! 🔔';
        } else {
            message = `🎉 BA ${first.icon} GIỐNG NHAU! 🎉`;
        }

        return {
            amount: winAmount,
            multiplier: multiplier,
            message: message,
            type: 'triple'
        };
    }

    // Check for two of a kind
    if (first.icon === second.icon || second.icon === third.icon || first.icon === third.icon) {
        const multiplier = 2;
        const winAmount = currentBet * multiplier;

        return {
            amount: winAmount,
            multiplier: multiplier,
            message: '✨ HAI BIỂU TƯỢNG GIỐNG NHAU! ✨',
            type: 'double'
        };
    }

    // Check for any 7s (consolation prize)
    const sevenCount = results.filter(r => r.icon === '7️⃣').length;
    if (sevenCount > 0) {
        const multiplier = 1.5;
        const winAmount = Math.floor(currentBet * multiplier);

        return {
            amount: winAmount,
            multiplier: multiplier,
            message: '🎰 CÓ SỐ 7 MAY MẮN! 🎰',
            type: 'lucky'
        };
    }

    // No win
    return {
        amount: 0,
        multiplier: 0,
        message: '',
        type: 'loss'
    };
}

// Display win result
function displayWin(winData) {
    winMessage.textContent = winData.message;
    winAmount.textContent = `+${formatMoney(winData.amount)}`;
    
    winDisplay.classList.add('show');

    // Play win animation
    if (winData.type === 'triple') {
        winDisplay.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 107, 53, 0.4))';
        winMessage.style.fontSize = '2.5rem';
    } else {
        winDisplay.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.3))';
        winMessage.style.fontSize = '2rem';
    }

    showNotification(`Chúc mừng! Bạn thắng ${formatMoney(winData.amount)}! 🎉`, 'success');
}

// Highlight winning line
function highlightWinningLine() {
    // Highlight middle symbols (the visible center row)
    reelElements.forEach(reel => {
        const stripe = reel.querySelector('.reel-stripe');
        const symbols = stripe.querySelectorAll('.symbol');
        
        // Find which symbol is currently in the middle position
        const stripeTop = parseInt(stripe.style.top) || 0;
        const symbolHeight = window.innerWidth <= 768 ? (window.innerWidth <= 480 ? 80 : 100) : 160;
        const middleIndex = Math.abs(Math.round(stripeTop / symbolHeight)) + 1;
        
        if (symbols[middleIndex]) {
            symbols[middleIndex].classList.add('winning');
        }
    });

    // Show win line
    const winLine = document.querySelector('.win-line');
    if (winLine) {
        winLine.classList.add('active');
    }
}

// Update balance display
function updateBalanceUI() {
    if (balanceDisplay) {
        balanceDisplay.textContent = formatMoney(slotCurrentUser.balance);
    }
    
    // Update second balance in info bar
    const balanceDisplay2 = document.getElementById('userBalance2');
    if (balanceDisplay2) {
        balanceDisplay2.textContent = formatMoney(slotCurrentUser.balance);
    }
}

// Update stats
function updateStats() {
    if (winsDisplay) {
        winsDisplay.textContent = formatMoney(totalWins);
    }
    if (spinsDisplay) {
        spinsDisplay.textContent = totalSpins;
    }
}

// Format money
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00c853, #64dd17)' : 
                     type === 'error' ? 'linear-gradient(135deg, #f44336, #e91e63)' : 
                     'linear-gradient(135deg, #2196f3, #03a9f4)'};
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 1.1rem;
        font-weight: 600;
        max-width: 400px;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load user from localStorage
function loadUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

// Persist user balance
function persistUserBalance() {
    if (slotCurrentUser) {
        localStorage.setItem('currentUser', JSON.stringify(slotCurrentUser));
    }
}

// Add transaction to history
function addTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transaction);
    
    // Keep only last 50 transactions
    if (transactions.length > 50) {
        transactions = transactions.slice(0, 50);
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
