// --- VERİ ---
const questions = [
  {
    question: "typeof null sonucu nedir?",
    options: ["null", "undefined", "object", "string"],
    answer: "object",
  },
  {
    question: "let ile var arasındaki temel fark nedir?",
    options: [
      "let block-scoped'dur",
      "var block-scoped'dur",
      "İkisi aynıdır",
      "let hoisting yapmaz",
    ],
    answer: "let block-scoped'dur",
  },
  {
    question: "Array'in sonuna eleman ekleyen metod hangisidir?",
    options: ["push()", "pop()", "shift()", "splice()"],
    answer: "push()",
  },
  {
    question: "=== operatörü ne kontrol eder?",
    options: ["Sadece değer", "Sadece tip", "Değer ve tip", "Referans"],
    answer: "Değer ve tip",
  },
  {
    question: "console.log(0.1 + 0.2 === 0.3) sonucu?",
    options: ["true", "false", "NaN", "undefined"],
    answer: "false",
  },
  {
    question: "Arrow function'larda 'this' neye bağlıdır?",
    options: [
      "Çağıran nesneye",
      "window'a",
      "Tanımlandığı scope'a",
      "Her zaman undefined",
    ],
    answer: "Tanımlandığı scope'a",
  },
  {
    question: "Array.map() ne döndürür?",
    options: ["Aynı array'i", "Yeni bir array", "undefined", "Boolean"],
    answer: "Yeni bir array",
  },
  {
    question: "Promise.resolve() ile ne elde edilir?",
    options: [
      "Rejected promise",
      "Pending promise",
      "Resolved promise",
      "Async function",
    ],
    answer: "Resolved promise",
  },
  {
    question: "JSON.stringify() ne yapar?",
    options: [
      "JSON'u parse eder",
      "Objeyi string'e çevirir",
      "String'i objeye çevirir",
      "Objeyi kopyalar",
    ],
    answer: "Objeyi string'e çevirir",
  },
  {
    question: "Array.filter() hangi elemanları döndürür?",
    options: [
      "Tüm elemanları",
      "Callback true dönen elemanları",
      "İlk elemanı",
      "Son elemanı",
    ],
    answer: "Callback true dönen elemanları",
  },
];

// --- STATE ---
let currentIndex = 0; // hangi soruda olduğumuz
let score = 0; // doğru cevap sayısı
let timerInterval = null; // setInterval referansı
let timeLeft = 15; // kalan süre

// --- DOM SEÇİCİLER ---
const screenStart = document.getElementById("screen-start");
const screenQuiz = document.getElementById("screen-quiz");
const screenResult = document.getElementById("screen-result");

const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const questionCount = document.getElementById("question-count");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const timerEl = document.getElementById("timer");
const scoreText = document.getElementById("score-text");
const highScoreText = document.getElementById("high-score-text");

// --- YARDIMCI FONKSİYON: Ekran Geçişi ---
function showScreen(screen) {
  screenStart.classList.add("hidden");
  screenQuiz.classList.add("hidden");
  screenResult.classList.add("hidden");
  screen.classList.remove("hidden");
}

// --- SORU RENDER ---
function renderQuestion() {
  const q = questions[currentIndex];

  questionCount.textContent = `Soru ${currentIndex + 1} / ${questions.length}`;
  questionText.textContent = q.question;

  // Önceki şıkları temizle
  optionsContainer.innerHTML = "";

  // Her şık için buton oluştur (forEach ile)
  q.options.forEach(function (option) {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = option;
    btn.addEventListener("click", function () {
      handleAnswer(option);
    });
    optionsContainer.appendChild(btn);
  });
}

// --- ZAMANLAYICI ---
function startTimer() {
  timeLeft = 15;
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(function () {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(null); // süre doldu, null gönder
    }
  }, 1000);
}

// --- CEVAP KONTROLÜ ---
function handleAnswer(selected) {
  clearInterval(timerInterval); // timer'ı durdur

  const q = questions[currentIndex];
  const buttons = optionsContainer.querySelectorAll(".option-btn");

  // Tüm butonları devre dışı bırak
  buttons.forEach(function (btn) {
    btn.disabled = true;

    if (btn.textContent === q.answer) {
      btn.classList.add("correct"); // doğru cevabı yeşil yap
    }
    if (btn.textContent === selected && selected !== q.answer) {
      btn.classList.add("wrong"); // yanlış seçimi kırmızı yap
    }
  });

  // Skoru güncelle
  if (selected === q.answer) score++;

  // 1 saniye bekle, sonraki soruya geç
  setTimeout(nextQuestion, 1000);
}

// --- SONRAKİ SORU ---
function nextQuestion() {
  currentIndex++;

  if (currentIndex < questions.length) {
    renderQuestion();
    startTimer();
  } else {
    showResult();
  }
}

// --- SONUÇ EKRANI ---
function showResult() {
  showScreen(screenResult);
  scoreText.textContent = `${score} / ${questions.length} doğru cevap`;

  // localStorage: high score kontrolü
  const prevHigh = localStorage.getItem("highScore") || 0;
  if (score > prevHigh) {
    localStorage.setItem("highScore", score);
    highScoreText.textContent = "🏆 Yeni rekor!";
  } else {
    highScoreText.textContent = `En yüksek skorun: ${prevHigh}`;
  }
}

// --- BUTON EVENT LİSTENER'LAR ---
btnStart.addEventListener("click", function () {
  // State sıfırla
  currentIndex = 0;
  score = 0;

  showScreen(screenQuiz);
  renderQuestion();
  startTimer();
});

btnRestart.addEventListener("click", function () {
  currentIndex = 0;
  score = 0;

  showScreen(screenQuiz);
  renderQuestion();
  startTimer();
});
