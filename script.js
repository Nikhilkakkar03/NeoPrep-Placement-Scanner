// 1. DATA
const companies = [
  { name: "TCS", quant: 40, verbal: 30, logical: 30, cutoff: 65 },
  { name: "Infosys", quant: 20, verbal: 20, logical: 60, cutoff: 70 },
  { name: "Wipro", quant: 50, verbal: 20, logical: 30, cutoff: 60 },
  { name: "Accenture", quant: 35, verbal: 35, logical: 30, cutoff: 55 },
  { name: "Cognizant", quant: 30, verbal: 35, logical: 35, cutoff: 62 },
  { name: "Capgemini", quant: 35, verbal: 30, logical: 35, cutoff: 58 }
];

const questions = [
  { text: "What is 15% of 200?", options: ["15", "20", "30", "45"], correct: 2, section: "Quant" },
  { text: "Train travels 120 km in 2 hrs. Speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correct: 1, section: "Quant" },
  { text: "If CP=100, SP=120, profit %?", options: ["10%", "15%", "20%", "25%"], correct: 2, section: "Quant" },
  { text: "Average of 10, 20, 30, 40?", options: ["20", "25", "30", "35"], correct: 1, section: "Quant" },
  { text: "Choose correct spelling:", options: ["Recieve", "Receive", "Receeve", "Receve"], correct: 1, section: "Verbal" },
  { text: "Synonym of 'Abundant':", options: ["Scarce", "Plentiful", "Rare", "Empty"], correct: 1, section: "Verbal" },
  { text: "Antonym of 'Ancient':", options: ["Old", "Modern", "Historic", "Past"], correct: 1, section: "Verbal" },
  { text: "One word: 'A person who loves books'", options: ["Bibliophile", "Philanthropist", "Philatelist", "Botanist"], correct: 0, section: "Verbal" },
  { text: "Find next: 2, 4, 8, 16, ?", options: ["20", "24", "32", "30"], correct: 2, section: "Logical" },
  { text: "If A > B and B > C, then:", options: ["A &lt; C", "A = C", "A &gt; C", "Cannot say"], correct: 2, section: "Logical" },
  { text: "Odd one out: Dog, Cat, Lion, Rose", options: ["Dog", "Cat", "Lion", "Rose"], correct: 3, section: "Logical" },
  { text: "If MONDAY is coded as NPOEBZ, then FRIDAY is:", options: ["GSJEBZ", "GSJFBZ", "GSIEBZ", "GRJEBZ"], correct: 0, section: "Logical" }
];

// 2. START TEST
function startTest() {
  document.getElementById("welcomeSection").classList.add("hidden");
  document.getElementById("testSection").classList.remove("hidden");
  renderQuestions();
}

// 3. RENDER QUESTIONS
function renderQuestions() {
  const container = document.getElementById("questionsContainer");
  
  questions.forEach((q, index) => {
    let optionsHTML = "";
    q.options.forEach((opt, i) => {
      optionsHTML += `
        <label>
          <input type="radio" name="q${index}" value="${i}" onchange="updateProgress()">
          ${opt}
        </label>
      `;
    });

    container.innerHTML += `
      <div class="q-block">
        <h4>Q${index + 1}. ${q.text}</h4>
        <div class="options">${optionsHTML}</div>
      </div>
    `;
  });
}

// 4. LIVE PROGRESS BAR
function updateProgress() {
  const totalQuestions = questions.length;
  let answered = 0;
  
  for (let i = 0; i < totalQuestions; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) answered++;
  }
  
  const percent = (answered / totalQuestions) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = `${answered} of ${totalQuestions} answered`;
}

// 5. SUBMIT & CALCULATE
function submitTest() {
  let qCorrect = 0, vCorrect = 0, lCorrect = 0;
  let qTotal = 0, vTotal = 0, lTotal = 0;
  let unanswered = 0;

  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    
    if (q.section === "Quant") qTotal++;
    if (q.section === "Verbal") vTotal++;
    if (q.section === "Logical") lTotal++;

    if (!selected) {
      unanswered++;
    } else {
      const answer = parseInt(selected.value);
      if (answer === q.correct) {
        if (q.section === "Quant") qCorrect++;
        if (q.section === "Verbal") vCorrect++;
        if (q.section === "Logical") lCorrect++;
      }
    }
  });

  if (unanswered > 0) {
    alert(`Please answer all questions. You have ${unanswered} unanswered.`);
    return;
  }

  const qScore = Math.round((qCorrect / qTotal) * 100);
  const vScore = Math.round((vCorrect / vTotal) * 100);
  const lScore = Math.round((lCorrect / lTotal) * 100);

  displayReport(qScore, vScore, lScore);
}

// 6. DISPLAY REPORT
function displayReport(q, v, l) {
  document.getElementById("testSection").classList.add("hidden");
  document.getElementById("reportSection").classList.remove("hidden");

  document.getElementById("qScore").innerText = q + "%";
  document.getElementById("vScore").innerText = v + "%";
  document.getElementById("lScore").innerText = l + "%";

  const companyList = document.getElementById("companyList");
  let bestFit = { name: "", score: -1 };

  companies.forEach(c => {
    let readiness = Math.round((q * c.quant + v * c.verbal + l * c.logical) / 100);
    
    if (readiness > bestFit.score) bestFit = { name: c.name, score: readiness };

    const isQualified = readiness >= c.cutoff;
    const barColor = isQualified ? "#10b981" : "#f43f5e";
    const statusClass = isQualified ? "status-ok" : "status-fail";

    companyList.innerHTML += `
      <div class="company-item" onclick="showCompanyDetails('${c.name}', ${c.quant}, ${c.verbal}, ${c.logical}, ${c.cutoff})">
        <div class="company-name">${c.name}</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${readiness}%; background: ${barColor};"></div>
        </div>
        <div class="status ${statusClass}">${readiness}%</div>
      </div>
    `;
  });

  document.getElementById("bestFitText").innerText = `${bestFit.name} (${bestFit.score}% Match)`;

  const gapContainer = document.getElementById("gapAnalysis");
  
  companies.forEach(c => {
    let readiness = Math.round((q * c.quant + v * c.verbal + l * c.logical) / 100);
    let gap = c.cutoff - readiness;

    if (gap <= 0) {
      gapContainer.innerHTML += `
        <div class="gap-item qualified">
          <strong>${c.name}</strong>
          <p>Status: QUALIFIED ✅ You exceed the ${c.cutoff}% cutoff.</p>
        </div>
      `;
    } else {
      let weakest = "Quant";
      let minScore = q;
      if (v < minScore) { minScore = v; weakest = "Verbal"; }
      if (l < minScore) { minScore = l; weakest = "Logical"; }

      gapContainer.innerHTML += `
        <div class="gap-item">
          <strong>${c.name}</strong>
          <p>Gap: ${gap}% short. Improve <b>${weakest}</b> (Currently ${minScore}%) to qualify.</p>
        </div>
      `;
    }
  });
}

// 7. SHOW COMPANY DETAILS MODAL
function showCompanyDetails(name, quant, verbal, logical, cutoff) {
  document.getElementById("modalCompanyName").innerText = name + " Requirements";
  document.getElementById("modalCompanyDetails").innerHTML = `
    <p style="margin-bottom: 15px; color: #cbd5e1;">Weightage ${name} looks for:</p>
    <p style="margin-bottom: 8px;">📊 Quantitative: <strong>${quant}%</strong></p>
    <p style="margin-bottom: 8px;">📖 Verbal: <strong>${verbal}%</strong></p>
    <p style="margin-bottom: 8px;">🧠 Logical: <strong>${logical}%</strong></p>
    <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">Minimum Cutoff: <strong style="color: #38bdf8;">${cutoff}%</strong></p>
  `;
  document.getElementById("companyModal").style.display = "flex";
}

// 8. CLOSE MODAL
function closeCompanyModal() {
  document.getElementById("companyModal").style.display = "none";
}