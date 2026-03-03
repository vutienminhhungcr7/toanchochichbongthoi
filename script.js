// Đáp án đúng
const correctAnswers = {
    q1: 'a',  // 20/2 = 10 km/giờ
    q2: 'a',  // 60 * 3 = 180 km
    q3: '60', // 120/2 = 60 km/giờ
    q4: 'a',  // 12 * 0.5 = 6 km
    q5: '2',  // 90/45 = 2 giờ
    q6: 'a',  // 80 * 2.5 = 200 km
    q7: 'a',  // 150/5 = 30 km/giờ
    q8: '2400', // 600 * 4 = 2400 km
    q9: 'a',  // 240/60 = 4 giờ
    q10: 'a'  // 16 * 0.25 = 4 km
};

// Chi tiết câu hỏi
const questionDetails = {
    q1: {
        question: "Xe đạp đi 20 km trong 2 giờ",
        correct: "10 km/giờ",
        formula: "Vận tốc = 20 ÷ 2 = 10 km/giờ"
    },
    q2: {
        question: "Ô tô vận tốc 60 km/giờ đi trong 3 giờ",
        correct: "180 km",
        formula: "Quãng đường = 60 × 3 = 180 km"
    },
    q3: {
        question: "Tàu chạy 120 km trong 2 giờ",
        correct: "60 km/giờ",
        formula: "Vận tốc = 120 ÷ 2 = 60 km/giờ"
    },
    q4: {
        question: "Chạy 12 km/giờ trong 30 phút",
        correct: "6 km",
        formula: "Quãng đường = 12 × 0,5 = 6 km"
    },
    q5: {
        question: "Xe máy đi 90 km với vận tốc 45 km/giờ",
        correct: "2 giờ",
        formula: "Thời gian = 90 ÷ 45 = 2 giờ"
    },
    q6: {
        question: "Xe buýt đi 2,5 giờ với vận tốc 80 km/giờ",
        correct: "200 km",
        formula: "Quãng đường = 80 × 2,5 = 200 km"
    },
    q7: {
        question: "Tàu đi 150 km trong 5 giờ",
        correct: "30 km/giờ",
        formula: "Vận tốc = 150 ÷ 5 = 30 km/giờ"
    },
    q8: {
        question: "Máy bay bay 600 km/giờ trong 4 giờ",
        correct: "2400 km",
        formula: "Quãng đường = 600 × 4 = 2400 km"
    },
    q9: {
        question: "Hai thành phố cách nhau 240 km, vận tốc 60 km/giờ",
        correct: "4 giờ",
        formula: "Thời gian = 240 ÷ 60 = 4 giờ"
    },
    q10: {
        question: "Đi 15 phút với vận tốc 16 km/giờ",
        correct: "4 km",
        formula: "Quãng đường = 16 × 0,25 = 4 km"
    }
};

// Xử lý form submit
document.getElementById('velocityQuiz').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    let score = 0;
    let results = [];
    
    // Kiểm tra từng câu trả lời
    for (let question in correctAnswers) {
        const userAnswer = formData.get(question);
        const isCorrect = userAnswer === correctAnswers[question];
        
        if (isCorrect) {
            score++;
            results.push({
                question: question,
                correct: true,
                detail: questionDetails[question]
            });
        } else {
            results.push({
                question: question,
                correct: false,
                detail: questionDetails[question],
                userAnswer: userAnswer
            });
        }
    }
    
    // Hiển thị kết quả
    displayResults(score, results, formData.get('studentName'), formData.get('studentClass'));
});

function displayResults(score, results, studentName, studentClass) {
    // Ẩn form
    document.getElementById('velocityQuiz').style.display = 'none';
    
    // Hiển thị kết quả
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // Hiển thị điểm
    document.getElementById('scoreDisplay').textContent = score;
    
    // Thông điệp kết quả
    let message = '';
    let emoji = '';
    if (score === 10) {
        message = 'Xuất sắc! Bạn làm rất tốt! 🌟';
        emoji = '🏆';
    } else if (score >= 8) {
        message = 'Giỏi lắm! Bạn đã làm tốt! 👏';
        emoji = '⭐';
    } else if (score >= 6) {
        message = 'Khá đấy! Cố gắng thêm nhé! 💪';
        emoji = '👍';
    } else if (score >= 4) {
        message = 'Bạn cần ôn tập thêm nhé! 📚';
        emoji = '📖';
    } else {
        message = 'Hãy cố gắng hơn nữa bạn nhé! 💪';
        emoji = '📝';
    }
    
    document.getElementById('resultMessage').textContent = message;
    
    // Hiển thị chi tiết
    const detailsHTML = `
        <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
            <h3 style="color: #667eea; margin-bottom: 10px; font-size: 20px;">
                <i class="fas fa-user-graduate"></i> ${studentName}
            </h3>
            <p style="color: #666; font-size: 16px;">Lớp: ${studentClass}</p>
        </div>
        <h4 style="color: #333; margin-bottom: 15px; font-size: 18px;">
            <i class="fas fa-clipboard-list"></i> Chi tiết bài làm:
        </h4>
        ${results.map((result, index) => `
            <div class="detail-item ${result.correct ? 'correct' : 'incorrect'}">
                <i class="fas ${result.correct ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <div style="flex: 1;">
                    <strong>Câu ${index + 1}:</strong> ${result.detail.question}
                    <br>
                    <small style="color: #666;">
                        ${result.correct ? 
                            `✓ Đúng: ${result.detail.correct}` : 
                            `✗ Sai - Đáp án đúng: ${result.detail.correct}`
                        }
                    </small>
                    <br>
                    <small style="color: #999; font-style: italic;">
                        💡 ${result.detail.formula}
                    </small>
                </div>
            </div>
        `).join('')}
    `;
    
    document.getElementById('resultDetails').innerHTML = detailsHTML;
    
    // Cuộn đến kết quả
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Thêm hiệu ứng khi người dùng chọn đáp án
document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Xóa class selected từ tất cả các option trong nhóm
        const name = this.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
            input.parentElement.classList.remove('selected');
        });
        
        // Thêm class selected vào option được chọn
        this.parentElement.classList.add('selected');
    });
});

// Thêm CSS cho class selected
const style = document.createElement('style');
style.textContent = `
    .option.selected {
        background: #e8f0fe !important;
        border-color: #667eea !important;
        transform: translateX(5px);
    }
`;
document.head.appendChild(style);

// Theo dõi tiến độ
let answeredQuestions = new Set();

function updateProgress() {
    const totalQuestions = 10;
    const progressPercentage = (answeredQuestions.size / totalQuestions) * 100;
    
    // Có thể thêm thanh tiến độ nếu muốn
    console.log(`Đã hoàn thành: ${answeredQuestions.size}/${totalQuestions} câu (${progressPercentage.toFixed(0)}%)`);
}

// Lắng nghe sự thay đổi của các input
document.querySelectorAll('input[type="radio"], input[type="number"], input[type="text"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.name.startsWith('q')) {
            answeredQuestions.add(this.name);
            updateProgress();
        }
    });
});

// Xác nhận trước khi rời trang nếu chưa nộp bài
window.addEventListener('beforeunload', function(e) {
    if (answeredQuestions.size > 0 && document.getElementById('resultSection').style.display === 'none') {
        e.preventDefault();
        e.returnValue = 'Bạn có chắc muốn rời khỏi trang? Bài làm của bạn sẽ không được lưu!';
        return e.returnValue;
    }
});
