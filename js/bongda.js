// Bóng Đá Game Logic

let currentUser = null;
let userBalance = 0;
let totalWin = 0;
let ticketCount = 0;
let selectedBet = null;
let currentMatch = null;

// Danh sách đội bóng
const TEAM_POOL = [
    { name: 'Hanoi Dragons', short: 'HNI' },
    { name: 'Saigon Thunder', short: 'SGN' },
    { name: 'Da Nang Waves', short: 'DNA' },
    { name: 'Can Tho United', short: 'CTU' },
    { name: 'Hue Warriors', short: 'HUE' },
    { name: 'Hai Phong Sharks', short: 'HPH' },
    { name: 'Nha Trang FC', short: 'NTR' },
    { name: 'Quang Ninh Stars', short: 'QNH' },
    { name: 'Binh Duong Eagles', short: 'BDG' },
    { name: 'Nam Dinh Lions', short: 'NDH' },
    { name: 'Vung Tau Storm', short: 'VTU' },
    { name: 'Thai Binh City', short: 'TBH' }
];

// Danh sách huấn luyện viên
const COACHES = [
    'Nguyễn Văn A', 'Trần Minh B', 'Lê Hoàng C', 'Phạm Đức D',
    'Võ Thành E', 'Đỗ Công F', 'Bùi Hữu G', 'Hoàng Anh H'
];

// Danh sách sân vận động
const STADIUMS = [
    { name: 'Sân Mỹ Đình', capacity: '40,000' },
    { name: 'Sân Thống Nhất', capacity: '25,000' },
    { name: 'Sân Chi Lăng', capacity: '20,000' },
    { name: 'Sân Hàng Đẫy', capacity: '22,000' },
    { name: 'Sân Gò Đậu', capacity: '18,000' },
    { name: 'Sân Thiên Trường', capacity: '30,000' }
];

// Utility Functions
function formatMoney(amount) {
    return Math.floor(amount).toLocaleString('vi-VN') + 'đ';
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFormation() {
    const formations = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3'];
    return randomElement(formations);
}

// Tạo tên cầu thủ ngẫu nhiên
function generatePlayerName() {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Võ', 'Phan', 'Đặng', 'Bùi'];
    const midNames = ['Văn', 'Thị', 'Minh', 'Hoàng', 'Đức', 'Hữu', 'Thành', 'Công', 'Anh'];
    const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khoa', 'Long', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tài', 'Thắng', 'Tuấn', 'Vinh'];
    
    return `${randomElement(firstNames)} ${randomElement(midNames)} ${randomElement(lastNames)}`;
}

// Tạo đội hình
function generateLineup(formation) {
    const [def, mid, fwd] = formation.split('-').map(Number);
    const lineup = {
        formation: formation,
        goalkeeper: { number: 1, name: generatePlayerName() },
        defenders: [],
        midfielders: [],
        forwards: []
    };

    let num = 2;
    for (let i = 0; i < def; i++) {
        lineup.defenders.push({ number: num++, name: generatePlayerName() });
    }
    for (let i = 0; i < mid; i++) {
        lineup.midfielders.push({ number: num++, name: generatePlayerName() });
    }
    for (let i = 0; i < fwd; i++) {
        lineup.forwards.push({ number: num++, name: generatePlayerName() });
    }

    return lineup;
}

// Tạo danh sách dự bị
function generateSubstitutes() {
    const subs = [];
    for (let i = 0; i < 7; i++) {
        subs.push({
            number: 12 + i,
            name: generatePlayerName()
        });
    }
    return subs;
}

// Tạo thông tin trận đấu chi tiết
function generateMatchDetails(homeTeam, awayTeam) {
    const stadium = randomElement(STADIUMS);
    const homeFormation = generateFormation();
    const awayFormation = generateFormation();

    return {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        stadium: stadium.name,
        capacity: stadium.capacity,
        referee: generatePlayerName(),
        weather: randomElement(['Nắng', 'Có mây', 'Mưa nhẹ', 'Trời quang']),
        temperature: randomInt(20, 35) + '°C',
        homeCoach: randomElement(COACHES),
        awayCoach: randomElement(COACHES),
        homeLineup: generateLineup(homeFormation),
        awayLineup: generateLineup(awayFormation),
        homeSubstitutes: generateSubstitutes(),
        awaySubstitutes: generateSubstitutes()
    };
}

// Tạo kết quả trận đấu
function generateMatchResult() {
    const homeScore = randomInt(0, 4);
    const awayScore = randomInt(0, 4);
    const events = [];

    // Tạo sự kiện bàn thắng
    for (let i = 0; i < homeScore; i++) {
        events.push({
            time: randomInt(1, 90) + "'",
            type: 'goal',
            team: 'home',
            description: `${generatePlayerName()} ghi bàn`,
            icon: '⚽'
        });
    }

    for (let i = 0; i < awayScore; i++) {
        events.push({
            time: randomInt(1, 90) + "'",
            type: 'goal',
            team: 'away',
            description: `${generatePlayerName()} ghi bàn`,
            icon: '⚽'
        });
    }

    // Thêm thẻ phạt ngẫu nhiên
    const yellowCards = randomInt(0, 4);
    for (let i = 0; i < yellowCards; i++) {
        events.push({
            time: randomInt(1, 90) + "'",
            type: 'yellow',
            team: Math.random() > 0.5 ? 'home' : 'away',
            description: `${generatePlayerName()} nhận thẻ vàng`,
            icon: '🟨'
        });
    }

    if (Math.random() > 0.8) {
        events.push({
            time: randomInt(30, 90) + "'",
            type: 'red',
            team: Math.random() > 0.5 ? 'home' : 'away',
            description: `${generatePlayerName()} nhận thẻ đỏ`,
            icon: '🟥'
        });
    }

    // Sắp xếp sự kiện theo thời gian
    events.sort((a, b) => parseInt(a.time) - parseInt(b.time));

    return {
        homeScore: homeScore,
        awayScore: awayScore,
        events: events,
        stats: {
            possession: [randomInt(40, 60), randomInt(40, 60)],
            shots: [randomInt(5, 20), randomInt(5, 20)],
            shotsOnTarget: [randomInt(2, 10), randomInt(2, 10)],
            corners: [randomInt(0, 12), randomInt(0, 12)],
            fouls: [randomInt(5, 20), randomInt(5, 20)]
        }
    };
}

// Load user data
function loadUser() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
        alert('Vui lòng đăng nhập trước khi chơi game.');
        window.location.href = '../../index.html';
        return false;
    }

    try {
        currentUser = JSON.parse(raw);
    } catch (error) {
        currentUser = null;
    }

    if (!currentUser || !currentUser.username) {
        alert('Thông tin tài khoản không hợp lệ, vui lòng đăng nhập lại.');
        window.location.href = '../../index.html';
        return false;
    }

    userBalance = Number(currentUser.balance || 0);
    return true;
}

// Update balance UI
function updateBalanceUI() {
    const currentBalanceEl = document.getElementById('currentBalance');
    const headerBalanceEl = document.getElementById('headerBalance');
    const totalWinEl = document.getElementById('totalWin');
    const ticketCountEl = document.getElementById('ticketCount');

    if (currentBalanceEl) currentBalanceEl.textContent = formatMoney(userBalance);
    if (headerBalanceEl) headerBalanceEl.textContent = Math.floor(userBalance).toLocaleString('vi-VN');
    if (totalWinEl) totalWinEl.textContent = formatMoney(totalWin);
    if (ticketCountEl) ticketCountEl.textContent = String(ticketCount);
}

// Persist user balance
function persistUserBalance() {
    currentUser.balance = userBalance;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === currentUser.username);
    if (idx >= 0) {
        users[idx].balance = userBalance;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Add transaction
function addTransaction(amount, status, detail) {
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    history.push({
        id: Date.now().toString(),
        username: currentUser.username,
        type: 'game',
        game: 'Bóng Đá',
        amount: amount,
        status: status,
        date: new Date().toISOString(),
        detail: detail
    });
    localStorage.setItem('transactionHistory', JSON.stringify(history));
}

// Show match info modal
function showMatchInfo(matchData) {
    const modal = document.getElementById('matchInfoModal');
    if (!modal) return;

    const details = generateMatchDetails(matchData.homeTeam, matchData.awayTeam);
    currentMatch = { ...matchData, details };

    // Fill modal content
    document.getElementById('modalHomeTeam').textContent = details.homeTeam;
    document.getElementById('modalAwayTeam').textContent = details.awayTeam;
    document.getElementById('modalLeague').textContent = matchData.league;
    document.getElementById('modalKickoff').textContent = matchData.kickoff;
    document.getElementById('modalStadium').textContent = details.stadium;
    document.getElementById('modalCapacity').textContent = details.capacity + ' chỗ';
    document.getElementById('modalReferee').textContent = details.referee;
    document.getElementById('modalWeather').textContent = details.weather + ' • ' + details.temperature;
    document.getElementById('modalHomeCoach').textContent = details.homeCoach;
    document.getElementById('modalAwayCoach').textContent = details.awayCoach;

    // Home lineup
    document.getElementById('homeFormation').textContent = details.homeLineup.formation;
    renderLineup('homeLineup', details.homeLineup);
    renderSubstitutes('homeSubstitutes', details.homeSubstitutes);

    // Away lineup
    document.getElementById('awayFormation').textContent = details.awayLineup.formation;
    renderLineup('awayLineup', details.awayLineup);
    renderSubstitutes('awaySubstitutes', details.awaySubstitutes);

    modal.classList.add('active');
}

// Render lineup
function renderLineup(containerId, lineup) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
        <div class="field">
            <div class="field-line">
                <div class="player-item goalkeeper">⚽ ${lineup.goalkeeper.number}. ${lineup.goalkeeper.name}</div>
            </div>
            <div class="field-line">
                ${lineup.defenders.map(p => `<div class="player-item">${p.number}. ${p.name}</div>`).join('')}
            </div>
            <div class="field-line">
                ${lineup.midfielders.map(p => `<div class="player-item">${p.number}. ${p.name}</div>`).join('')}
            </div>
            <div class="field-line">
                ${lineup.forwards.map(p => `<div class="player-item">${p.number}. ${p.name}</div>`).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Render substitutes
function renderSubstitutes(containerId, substitutes) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = substitutes.map(s => `
        <div class="substitute-item">
            <span class="number">${s.number}.</span> ${s.name}
        </div>
    `).join('');

    container.innerHTML = html;
}

// Close modal
function closeMatchInfo() {
    const modal = document.getElementById('matchInfoModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Navigate to match betting page
function goToBetting(matchData) {
    // Lưu thông tin trận đấu vào localStorage
    localStorage.setItem('selectedMatch', JSON.stringify(matchData));
    window.location.href = 'bongda-match.html';
}

// Set selected bet
function setSelectedBet(button) {
    document.querySelectorAll('.odd-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const group = button.dataset.group;
    const market = button.dataset.market;
    const label = button.dataset.label || market;
    const odds = Number(button.dataset.odds);

    selectedBet = {
        group: group,
        market: market,
        label: label,
        odds: odds
    };

    const selectedBetEl = document.getElementById('selectedBet');
    if (selectedBetEl) {
        selectedBetEl.innerHTML =
            '<strong>' + currentMatch.homeTeam + ' vs ' + currentMatch.awayTeam + '</strong><br>' +
            selectedBet.label + ' - Tỷ lệ: <strong>' + selectedBet.odds.toFixed(2) + '</strong>';
    }

    updateEstimatedPayout();
}

// Update estimated payout
function updateEstimatedPayout() {
    const amountInput = document.getElementById('betAmount');
    const payoutEl = document.getElementById('estimatedPayout');
    
    if (!amountInput || !payoutEl) return;

    const amount = Number(amountInput.value || 0);
    const payout = selectedBet ? amount * selectedBet.odds : 0;
    payoutEl.textContent = 'Tiền nhận dự kiến: ' + formatMoney(payout);
}

// Pick result from odds
function pickResultFromOdds(group) {
    const options = currentMatch.markets[group];
    if (!options || options.length === 0) return null;

    const weighted = options.map(o => ({
        market: o.market,
        weight: 1 / o.odds
    }));

    const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
    const r = Math.random() * totalWeight;
    let acc = 0;

    for (const item of weighted) {
        acc += item.weight;
        if (r <= acc) {
            return item.market;
        }
    }

    return weighted[weighted.length - 1].market;
}

// Place bet
function placeBet() {
    const amountInput = document.getElementById('betAmount');
    const resultBox = document.getElementById('resultBox');

    if (!selectedBet) {
        resultBox.className = 'result-box lose';
        resultBox.textContent = 'Bạn chưa chọn cửa cược.';
        return;
    }

    const amount = Number(amountInput.value || 0);

    if (!Number.isFinite(amount) || amount < 1000) {
        resultBox.className = 'result-box lose';
        resultBox.textContent = 'Tiền cược tối thiểu là 1,000đ.';
        return;
    }

    if (amount > userBalance) {
        resultBox.className = 'result-box lose';
        resultBox.textContent = 'Số dư không đủ để đặt cược.';
        return;
    }

    // Tạo kết quả trận đấu
    const matchResult = generateMatchResult();
    
    // Xác định kết quả cược
    const finalResult = pickResultFromOdds(selectedBet.group);
    if (!finalResult) {
        resultBox.className = 'result-box lose';
        resultBox.textContent = 'Không thể xử lý kèo đã chọn, vui lòng thử lại.';
        return;
    }

    const isWin = finalResult === selectedBet.market;

    userBalance -= amount;
    let netAmount = -amount;

    if (isWin) {
        const grossWin = amount * selectedBet.odds;
        userBalance += grossWin;
        totalWin += (grossWin - amount);
        netAmount = Math.floor(grossWin - amount);

        resultBox.className = 'result-box win';
        resultBox.innerHTML = 'Bạn THẮNG ' + formatMoney(grossWin - amount) + ' (tổng nhận ' + formatMoney(grossWin) + ').<br>';
        addTransaction(netAmount, 'success', 'Thắng cược bóng đá');
    } else {
        resultBox.className = 'result-box lose';
        resultBox.innerHTML = 'Bạn thua ' + formatMoney(amount) + '. Chúc may mắn lượt sau!<br>';
        addTransaction(netAmount, 'failed', 'Thua cược bóng đá');
    }

    // Hiển thị kết quả trận đấu
    displayMatchResult(matchResult);

    ticketCount += 1;
    persistUserBalance();
    updateBalanceUI();
    amountInput.value = '';
    updateEstimatedPayout();
    selectedBet = null;
    document.querySelectorAll('.odd-btn').forEach(btn => btn.classList.remove('active'));

    // KHÓA CƯỢC SAU KHI CÓ KẾT QUẢ
    lockBettingAfterResult();
}

// Display match result
function displayMatchResult(result) {
    const resultSection = document.getElementById('matchResultSection');
    if (!resultSection) return;

    const html = `
        <div class="final-score">
            <h3>KẾT QUẢ TRẬN ĐẤU</h3>
            <div>${currentMatch.homeTeam} <span class="score-display">${result.homeScore} - ${result.awayScore}</span> ${currentMatch.awayTeam}</div>
        </div>
        
        <div class="match-events">
            <h4><i class="fas fa-list"></i> Diễn biến trận đấu</h4>
            <div class="events-timeline">
                ${result.events.map(e => `
                    <div class="event-item">
                        <span class="event-time">${e.time}</span>
                        <span class="event-icon ${e.type}">${e.icon}</span>
                        <span class="event-description">${e.description}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="match-stats">
            <div class="stat-item">
                <div class="label">Kiểm soát bóng</div>
                <div class="value">${result.stats.possession[0]}% - ${result.stats.possession[1]}%</div>
            </div>
            <div class="stat-item">
                <div class="label">Cú sút</div>
                <div class="value">${result.stats.shots[0]} - ${result.stats.shots[1]}</div>
            </div>
            <div class="stat-item">
                <div class="label">Sút trúng đích</div>
                <div class="value">${result.stats.shotsOnTarget[0]} - ${result.stats.shotsOnTarget[1]}</div>
            </div>
            <div class="stat-item">
                <div class="label">Phạt góc</div>
                <div class="value">${result.stats.corners[0]} - ${result.stats.corners[1]}</div>
            </div>
            <div class="stat-item">
                <div class="label">Phạm lỗi</div>
                <div class="value">${result.stats.fouls[0]} - ${result.stats.fouls[1]}</div>
            </div>
        </div>
    `;

    resultSection.innerHTML = html;
    resultSection.style.display = 'block';
}

// Lock betting after match result
function lockBettingAfterResult() {
    // Disable all odd buttons
    document.querySelectorAll('.odd-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });

    // Disable amount input
    const amountInput = document.getElementById('betAmount');
    if (amountInput) {
        amountInput.disabled = true;
        amountInput.style.opacity = '0.5';
    }

    // Disable quick amount buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });

    // Disable place bet button
    const placeBetBtn = document.getElementById('placeBetBtn');
    if (placeBetBtn) {
        placeBetBtn.disabled = true;
        placeBetBtn.style.opacity = '0.5';
        placeBetBtn.style.cursor = 'not-allowed';
        placeBetBtn.innerHTML = '<i class="fas fa-check-circle"></i> Trận Đấu Đã Kết Thúc';
    }

    // Update selected bet message
    const selectedBetEl = document.getElementById('selectedBet');
    if (selectedBetEl) {
        selectedBetEl.innerHTML = '<strong style="color: #ffd700;">⚽ Trận đấu này đã kết thúc!</strong><br>Vui lòng quay lại để chọn trận đấu khác.';
    }

    // Add "Bet Another Match" button
    const betBox = document.querySelector('.bet-box');
    if (betBox && !document.getElementById('btnBetAnother')) {
        const btnAnother = document.createElement('button');
        btnAnother.id = 'btnBetAnother';
        btnAnother.className = 'btn-place';
        btnAnother.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
        btnAnother.style.color = '#00141f';
        btnAnother.innerHTML = '<i class="fas fa-arrow-left"></i> Cược Trận Khác';
        btnAnother.onclick = function() {
            window.location.href = 'bongda.html';
        };
        betBox.appendChild(btnAnother);
    }
}

// Initialize
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadUser,
        updateBalanceUI,
        showMatchInfo,
        closeMatchInfo,
        goToBetting,
        setSelectedBet,
        placeBet,
        formatMoney,
        generateMatchDetails,
        lockBettingAfterResult
    };
}
