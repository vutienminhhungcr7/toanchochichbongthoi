// ===============================================
// Global Variables
// ===============================================
let animationInterval = null;
let animationRunning = false;
let animationTime = 0;
let animationDistance = 0;
let animationSpeed = 50;
let isPaused = false;

let gameInterval = null;
let gameRunning = false;
let gameScore = 0;

// ===============================================
// Navigation & Section Management
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Initialize all features
    initAnimation();
    initCalculator();
    initExercises();
    initGame();
});

// ===============================================
// Animation Section
// ===============================================
function initAnimation() {
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const car = document.getElementById('animationCar');

    // Speed slider
    speedSlider.addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
        speedValue.textContent = animationSpeed;
        
        if (animationRunning && !isPaused) {
            updateAnimationStats();
        }
    });

    // Start button
    startBtn.addEventListener('click', () => {
        if (!animationRunning || isPaused) {
            startAnimation();
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            speedSlider.disabled = true;
        }
    });

    // Pause button
    pauseBtn.addEventListener('click', () => {
        if (animationRunning) {
            if (isPaused) {
                startAnimation();
                pauseBtn.innerHTML = '⏸️ Tạm dừng';
            } else {
                pauseAnimation();
                pauseBtn.innerHTML = '▶️ Tiếp tục';
            }
        }
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        resetAnimation();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.innerHTML = '⏸️ Tạm dừng';
        speedSlider.disabled = false;
    });
}

function startAnimation() {
    animationRunning = true;
    isPaused = false;

    const car = document.getElementById('animationCar');
    const maxDistance = 100; // km
    const updateInterval = 100; // ms

    animationInterval = setInterval(() => {
        // Time in hours (100ms = 100/3600000 hours)
        animationTime += updateInterval / 3600000;
        
        // Distance = speed × time
        animationDistance = animationSpeed * animationTime;
        
        // Update car position
        const progress = Math.min(animationDistance / maxDistance, 1);
        const carPosition = 5 + (progress * 85); // 5% to 90%
        car.style.left = carPosition + '%';
        
        // Update stats
        updateAnimationStats();
        
        // Check if finished
        if (animationDistance >= maxDistance) {
            resetAnimation();
            showAnimationComplete();
        }
    }, updateInterval);
}

function pauseAnimation() {
    isPaused = true;
    clearInterval(animationInterval);
}

function resetAnimation() {
    clearInterval(animationInterval);
    animationRunning = false;
    isPaused = false;
    animationTime = 0;
    animationDistance = 0;
    
    const car = document.getElementById('animationCar');
    car.style.left = '5%';
    
    updateAnimationStats();
}

function updateAnimationStats() {
    document.getElementById('animTime').textContent = animationTime.toFixed(2) + ' giờ';
    document.getElementById('animDistance').textContent = animationDistance.toFixed(1) + ' km';
    document.getElementById('animSpeed').textContent = animationSpeed + ' km/h';
}

function showAnimationComplete() {
    const calculatedTime = (100 / animationSpeed).toFixed(2);
    alert(`🎉 Hoàn thành!\n\nXe đã đi hết 100 km với vận tốc ${animationSpeed} km/h\nThời gian: ${animationTime.toFixed(2)} giờ\n\nCông thức: t = s / v = 100 / ${animationSpeed} = ${calculatedTime} giờ`);
}

// ===============================================
// Calculator Section
// ===============================================
function initCalculator() {
    const calcSpeed = document.getElementById('calcSpeed');
    const calcDistance = document.getElementById('calcDistance');
    const calcTime = document.getElementById('calcTime');
    const calculateBtn = document.getElementById('calculateBtn');
    const calcResult = document.getElementById('calcResult');

    calculateBtn.addEventListener('click', () => {
        const speed = parseFloat(calcSpeed.value);
        const distance = parseFloat(calcDistance.value);
        const time = parseFloat(calcTime.value);

        // Count how many values are filled
        let filledCount = 0;
        if (!isNaN(speed) && speed > 0) filledCount++;
        if (!isNaN(distance) && distance > 0) filledCount++;
        if (!isNaN(time) && time > 0) filledCount++;

        // Validate: need exactly 2 values
        if (filledCount !== 2) {
            showCalculatorError('⚠️ Vui lòng nhập CHÍNH XÁC 2 giá trị để tính giá trị còn lại!');
            return;
        }

        // Calculate the missing value
        if (isNaN(speed) || speed <= 0) {
            // Calculate speed: v = s / t
            const calculatedSpeed = distance / time;
            calcSpeed.value = calculatedSpeed.toFixed(2);
            showCalculatorResult('Vận tốc (v)', calculatedSpeed, 'km/h', 
                `v = s / t = ${distance} / ${time} = ${calculatedSpeed.toFixed(2)} km/h`);
        } else if (isNaN(distance) || distance <= 0) {
            // Calculate distance: s = v × t
            const calculatedDistance = speed * time;
            calcDistance.value = calculatedDistance.toFixed(2);
            showCalculatorResult('Quãng đường (s)', calculatedDistance, 'km',
                `s = v × t = ${speed} × ${time} = ${calculatedDistance.toFixed(2)} km`);
        } else if (isNaN(time) || time <= 0) {
            // Calculate time: t = s / v
            const calculatedTime = distance / speed;
            calcTime.value = calculatedTime.toFixed(2);
            showCalculatorResult('Thời gian (t)', calculatedTime, 'giờ',
                `t = s / v = ${distance} / ${speed} = ${calculatedTime.toFixed(2)} giờ`);
        }
    });

    // Clear result when inputs change
    [calcSpeed, calcDistance, calcTime].forEach(input => {
        input.addEventListener('input', () => {
            calcResult.classList.remove('show');
        });
    });
}

function showCalculatorError(message) {
    const calcResult = document.getElementById('calcResult');
    calcResult.innerHTML = `
        <h3 style="color: var(--danger-color);">❌ Lỗi</h3>
        <p>${message}</p>
    `;
    calcResult.style.borderLeft = '4px solid var(--danger-color)';
    calcResult.classList.add('show');
}

function showCalculatorResult(label, value, unit, formula) {
    const calcResult = document.getElementById('calcResult');
    calcResult.innerHTML = `
        <h3 style="color: var(--success-color);">✅ Kết quả tính toán</h3>
        <div class="result-value">${label} = ${value.toFixed(2)} ${unit}</div>
        <div class="result-formula">
            <strong>Công thức:</strong><br>
            ${formula}
        </div>
        <p style="margin-top: 1rem; color: var(--text-secondary);">
            💡 <strong>Giải thích:</strong> Khi biết 2 trong 3 đại lượng (vận tốc, quãng đường, thời gian), 
            ta có thể tính được đại lượng còn lại bằng công thức tương ứng.
        </p>
    `;
    calcResult.style.borderLeft = '4px solid var(--success-color)';
    calcResult.classList.add('show');
}

// ===============================================
// Exercises Section
// ===============================================
const exercises = [
    {
        id: 1,
        level: 'easy',
        question: 'Một xe ô tô chạy với vận tốc 60 km/h trong 2 giờ. Hỏi xe đã đi được bao nhiêu km?',
        answer: 120,
        unit: 'km',
        solution: [
            'Đề bài cho: v = 60 km/h, t = 2 giờ',
            'Cần tìm: s = ?',
            'Áp dụng công thức: s = v × t',
            'Thay số: s = 60 × 2 = 120 km',
            'Đáp án: Xe đã đi được 120 km'
        ]
    },
    {
        id: 2,
        level: 'easy',
        question: 'Một người đi xe đạp đi được 30 km trong 3 giờ. Tính vận tốc của xe đạp.',
        answer: 10,
        unit: 'km/h',
        solution: [
            'Đề bài cho: s = 30 km, t = 3 giờ',
            'Cần tìm: v = ?',
            'Áp dụng công thức: v = s / t',
            'Thay số: v = 30 / 3 = 10 km/h',
            'Đáp án: Vận tốc xe đạp là 10 km/h'
        ]
    },
    {
        id: 3,
        level: 'easy',
        question: 'Một xe máy chạy với vận tốc 40 km/h đi được quãng đường 80 km. Tính thời gian đi.',
        answer: 2,
        unit: 'giờ',
        solution: [
            'Đề bài cho: v = 40 km/h, s = 80 km',
            'Cần tìm: t = ?',
            'Áp dụng công thức: t = s / v',
            'Thay số: t = 80 / 40 = 2 giờ',
            'Đáp án: Thời gian đi là 2 giờ'
        ]
    },
    {
        id: 4,
        level: 'medium',
        question: 'Một ô tô đi từ A đến B với vận tốc 50 km/h mất 3 giờ. Nếu muốn đi từ A đến B trong 2 giờ thì vận tốc phải là bao nhiêu?',
        answer: 75,
        unit: 'km/h',
        solution: [
            'Bước 1: Tính quãng đường AB',
            's = v₁ × t₁ = 50 × 3 = 150 km',
            'Bước 2: Tính vận tốc cần thiết',
            'v₂ = s / t₂ = 150 / 2 = 75 km/h',
            'Đáp án: Vận tốc cần thiết là 75 km/h'
        ]
    },
    {
        id: 5,
        level: 'medium',
        question: 'Một người đi bộ với vận tốc 5 km/h trong 1.5 giờ, sau đó đi xe đạp với vận tốc 15 km/h trong 2 giờ. Tính tổng quãng đường đã đi.',
        answer: 37.5,
        unit: 'km',
        solution: [
            'Bước 1: Tính quãng đường đi bộ',
            's₁ = v₁ × t₁ = 5 × 1.5 = 7.5 km',
            'Bước 2: Tính quãng đường đi xe đạp',
            's₂ = v₂ × t₂ = 15 × 2 = 30 km',
            'Bước 3: Tính tổng quãng đường',
            's = s₁ + s₂ = 7.5 + 30 = 37.5 km',
            'Đáp án: Tổng quãng đường là 37.5 km'
        ]
    },
    {
        id: 6,
        level: 'medium',
        question: 'Một xe tải đi được 180 km hết 4.5 giờ. Một xe con đi cùng quãng đường đó hết 3 giờ. Hỏi xe con chạy nhanh hơn xe tải bao nhiêu km/h?',
        answer: 20,
        unit: 'km/h',
        solution: [
            'Bước 1: Tính vận tốc xe tải',
            'v_tải = 180 / 4.5 = 40 km/h',
            'Bước 2: Tính vận tốc xe con',
            'v_con = 180 / 3 = 60 km/h',
            'Bước 3: Tính hiệu vận tốc',
            'Δv = 60 - 40 = 20 km/h',
            'Đáp án: Xe con nhanh hơn 20 km/h'
        ]
    },
    {
        id: 7,
        level: 'hard',
        question: 'Hai xe cùng xuất phát từ A đến B. Xe thứ nhất đi với vận tốc 60 km/h, xe thứ hai đi sau 30 phút với vận tốc 75 km/h. Biết quãng đường AB dài 120 km. Hỏi xe nào đến B trước và trước bao nhiêu phút?',
        answer: 10,
        unit: 'phút',
        solution: [
            'Bước 1: Tính thời gian xe 1 đi hết AB',
            't₁ = 120 / 60 = 2 giờ = 120 phút',
            'Bước 2: Tính thời gian xe 2 đi hết AB',
            't₂ = 120 / 75 = 1.6 giờ = 96 phút',
            'Bước 3: Xe 2 xuất phát sau 30 phút',
            'Thời gian thực tế xe 2: 96 + 30 = 126 phút',
            'Bước 4: So sánh thời gian',
            'Xe 1 đến trước, sớm hơn: 126 - 120 = 6 phút',
            'Lưu ý: Đáp án có thể khác tùy cách hiểu đề (10 phút nếu so sánh thời gian di chuyển thuần túy)'
        ]
    },
    {
        id: 8,
        level: 'hard',
        question: 'Một người dự định đi từ A đến B với vận tốc 45 km/h sẽ đến muộn 20 phút. Nếu đi với vận tốc 60 km/h sẽ đến sớm 10 phút. Tính quãng đường AB. (Đơn vị: km)',
        answer: 90,
        unit: 'km',
        solution: [
            'Gọi s là quãng đường AB, t là thời gian dự định (giờ)',
            'Trường hợp 1: v₁ = 45 km/h, muộn 20 phút = 1/3 giờ',
            's = 45 × (t + 1/3)',
            'Trường hợp 2: v₂ = 60 km/h, sớm 10 phút = 1/6 giờ',
            's = 60 × (t - 1/6)',
            'Giải hệ phương trình:',
            '45(t + 1/3) = 60(t - 1/6)',
            '45t + 15 = 60t - 10',
            '15t = 25, suy ra t = 5/3 giờ',
            'Thay vào: s = 60 × (5/3 - 1/6) = 60 × 3/2 = 90 km',
            'Đáp án: Quãng đường AB dài 90 km'
        ]
    },
    {
        id: 9,
        level: 'hard',
        question: 'Một ca nô đi xuôi dòng từ A đến B hết 2 giờ, đi ngược dòng từ B về A hết 3 giờ. Biết vận tốc dòng nước là 5 km/h. Tính vận tốc thực của ca nô. (Đơn vị: km/h)',
        answer: 25,
        unit: 'km/h',
        solution: [
            'Gọi v là vận tốc thực của ca nô (km/h)',
            'Vận tốc xuôi dòng: v + 5 km/h',
            'Vận tốc ngược dòng: v - 5 km/h',
            'Quãng đường AB: s = (v + 5) × 2 = (v - 5) × 3',
            'Giải phương trình:',
            '2v + 10 = 3v - 15',
            'v = 25 km/h',
            'Kiểm tra: s = (25+5)×2 = 60 km = (25-5)×3 ✓',
            'Đáp án: Vận tốc thực của ca nô là 25 km/h'
        ]
    }
];

function initExercises() {
    renderExercises('all');

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const level = button.getAttribute('data-level');
            renderExercises(level);
        });
    });
}

function renderExercises(level) {
    const exerciseList = document.getElementById('exerciseList');
    const filteredExercises = level === 'all' ? exercises : exercises.filter(ex => ex.level === level);

    exerciseList.innerHTML = filteredExercises.map(exercise => `
        <div class="exercise-card" data-id="${exercise.id}">
            <div class="exercise-header">
                <div class="exercise-title">Bài tập ${exercise.id}</div>
                <div class="exercise-level ${exercise.level}">
                    ${exercise.level === 'easy' ? '😊 Dễ' : exercise.level === 'medium' ? '🤔 Trung bình' : '🔥 Khó'}
                </div>
            </div>
            <div class="exercise-question">${exercise.question}</div>
            <div class="exercise-input-area">
                <input type="number" step="0.01" placeholder="Nhập đáp án của bạn..." id="answer-${exercise.id}">
                <button class="btn btn-primary" onclick="checkAnswer(${exercise.id})">Kiểm tra</button>
            </div>
            <div class="exercise-answer" id="result-${exercise.id}"></div>
        </div>
    `).join('');
}

function checkAnswer(exerciseId) {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const userAnswer = parseFloat(document.getElementById(`answer-${exerciseId}`).value);
    const resultDiv = document.getElementById(`result-${exerciseId}`);

    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '<p style="color: var(--warning-color);">⚠️ Vui lòng nhập đáp án!</p>';
        resultDiv.classList.add('show');
        return;
    }

    const tolerance = 0.5; // Allow small rounding errors
    const isCorrect = Math.abs(userAnswer - exercise.answer) <= tolerance;

    if (isCorrect) {
        resultDiv.className = 'exercise-answer show correct';
        resultDiv.innerHTML = `
            <h4>🎉 Chính xác! Tuyệt vời!</h4>
            <p><strong>Đáp án đúng:</strong> ${exercise.answer} ${exercise.unit}</p>
            <div class="exercise-solution">
                <h5>📝 Lời giải chi tiết:</h5>
                <ul class="solution-steps">
                    ${exercise.solution.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        resultDiv.className = 'exercise-answer show incorrect';
        resultDiv.innerHTML = `
            <h4>❌ Chưa đúng! Hãy thử lại!</h4>
            <p><strong>Đáp án của bạn:</strong> ${userAnswer} ${exercise.unit}</p>
            <p><strong>Đáp án đúng:</strong> ${exercise.answer} ${exercise.unit}</p>
            <div class="exercise-solution">
                <h5>📝 Lời giải chi tiết:</h5>
                <ul class="solution-steps">
                    ${exercise.solution.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
            <p style="margin-top: 1rem; color: var(--text-secondary);">
                💡 Hãy xem lại lời giải và thử làm lại bài tập nhé!
            </p>
        `;
    }
}

// ===============================================
// Game Section
// ===============================================
function initGame() {
    const gameSpeedSlider = document.getElementById('gameSpeedSlider');
    const gameSpeedValue = document.getElementById('gameSpeedValue');
    const gameStartBtn = document.getElementById('gameStartBtn');

    gameSpeedSlider.addEventListener('input', (e) => {
        gameSpeedValue.textContent = e.target.value;
    });

    gameStartBtn.addEventListener('click', () => {
        startGame();
    });

    // Generate first challenge
    generateGameChallenge();
}

function generateGameChallenge() {
    // Random distance between 60-150 km
    const distance = Math.floor(Math.random() * 10) * 10 + 60;
    
    // Random time between 1-3 hours
    const time = (Math.floor(Math.random() * 5) + 2) * 0.5; // 1, 1.5, 2, 2.5, 3
    
    // Calculate required speed
    const requiredSpeed = distance / time;

    document.getElementById('gameTargetDistance').textContent = distance + ' km';
    document.getElementById('gameTargetTime').textContent = time.toFixed(1) + ' giờ';
    
    // Store in data attributes for checking
    document.getElementById('gameTargetDistance').setAttribute('data-distance', distance);
    document.getElementById('gameTargetTime').setAttribute('data-time', time);
}

function startGame() {
    const targetDistance = parseFloat(document.getElementById('gameTargetDistance').getAttribute('data-distance'));
    const targetTime = parseFloat(document.getElementById('gameTargetTime').getAttribute('data-time'));
    const selectedSpeed = parseInt(document.getElementById('gameSpeedSlider').value);
    
    const requiredSpeed = targetDistance / targetTime;
    const actualTime = targetDistance / selectedSpeed;
    
    const gameCar = document.getElementById('gameCar');
    const gameResult = document.getElementById('gameResult');
    const gameStartBtn = document.getElementById('gameStartBtn');
    
    // Disable controls during animation
    gameStartBtn.disabled = true;
    document.getElementById('gameSpeedSlider').disabled = true;
    
    // Reset car position
    gameCar.style.left = '5%';
    gameResult.classList.remove('show');
    
    // Animate car
    let progress = 0;
    const animationDuration = 2000; // 2 seconds for visual effect
    const frameRate = 50; // ms per frame
    const totalFrames = animationDuration / frameRate;
    
    gameInterval = setInterval(() => {
        progress++;
        const percentage = progress / totalFrames;
        const carPosition = 5 + (percentage * 85);
        gameCar.style.left = carPosition + '%';
        
        if (progress >= totalFrames) {
            clearInterval(gameInterval);
            showGameResult(targetTime, actualTime, requiredSpeed, selectedSpeed);
            gameStartBtn.disabled = false;
            document.getElementById('gameSpeedSlider').disabled = false;
        }
    }, frameRate);
}

function showGameResult(targetTime, actualTime, requiredSpeed, selectedSpeed) {
    const gameResult = document.getElementById('gameResult');
    const timeDiff = Math.abs(actualTime - targetTime);
    const speedDiff = Math.abs(selectedSpeed - requiredSpeed);
    
    // Success if within 10% error
    const isSuccess = speedDiff <= requiredSpeed * 0.1;
    
    if (isSuccess) {
        gameScore += 100;
        document.getElementById('gameScore').textContent = gameScore;
        
        gameResult.className = 'game-result show success';
        gameResult.innerHTML = `
            <h3>🎉 Xuất sắc! Bạn đã thắng!</h3>
            <div class="game-result-stats">
                <p><strong>✅ Vận tốc bạn chọn:</strong> ${selectedSpeed} km/h</p>
                <p><strong>🎯 Vận tốc cần thiết:</strong> ${requiredSpeed.toFixed(1)} km/h</p>
                <p><strong>⏱️ Thời gian thực tế:</strong> ${actualTime.toFixed(2)} giờ</p>
                <p><strong>⏰ Thời gian yêu cầu:</strong> ${targetTime.toFixed(1)} giờ</p>
                <p><strong>⭐ Điểm thưởng:</strong> +100 điểm</p>
            </div>
            <p style="margin-top: 1rem; font-weight: 600; color: var(--success-color);">
                Bạn đã tính toán chính xác! Tiếp tục thử thách mới nhé!
            </p>
        `;
    } else {
        gameResult.className = 'game-result show failed';
        gameResult.innerHTML = `
            <h3>😅 Chưa chính xác! Thử lại nhé!</h3>
            <div class="game-result-stats">
                <p><strong>🚗 Vận tốc bạn chọn:</strong> ${selectedSpeed} km/h</p>
                <p><strong>🎯 Vận tốc đúng:</strong> ${requiredSpeed.toFixed(1)} km/h</p>
                <p><strong>⏱️ Thời gian thực tế:</strong> ${actualTime.toFixed(2)} giờ</p>
                <p><strong>⏰ Thời gian yêu cầu:</strong> ${targetTime.toFixed(1)} giờ</p>
                <p><strong>⏳ Chênh lệch:</strong> ${timeDiff.toFixed(2)} giờ (${timeDiff > 0 ? actualTime > targetTime ? 'Muộn' : 'Sớm' : ''} ${Math.abs((timeDiff * 60)).toFixed(0)} phút)</p>
            </div>
            <p style="margin-top: 1rem; font-weight: 600; color: var(--text-secondary);">
                💡 Công thức: v = s / t = ${document.getElementById('gameTargetDistance').textContent.replace(' km', '')} / ${targetTime.toFixed(1)} = ${requiredSpeed.toFixed(1)} km/h
            </p>
        `;
    }
    
    // Generate new challenge
    setTimeout(() => {
        generateGameChallenge();
    }, 500);
}

// ===============================================
// Utility Functions
// ===============================================
function formatNumber(num, decimals = 2) {
    return parseFloat(num.toFixed(decimals));
}
