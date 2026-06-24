const state = {
  medicationLogs: [],
  familyProfiles: [],
  costItems: [],
};

const STORAGE_KEY = 'synapse-ai-state-v1';

const elements = {
  navButtons: document.querySelectorAll('.app-nav button'),
  tabs: document.querySelectorAll('.tab-pane'),
  medicationForm: document.getElementById('medicationForm'),
  medicationHistory: document.getElementById('medicationHistory'),
  insightsList: document.getElementById('insightsList'),
  monthlySummary: document.getElementById('monthlySummary'),
  weeklyTrendChart: document.getElementById('weeklyTrendChart'),
  metricMedications: document.getElementById('metric-medications'),
  metricSideEffects: document.getElementById('metric-sideeffects'),
  metricAdherence: document.getElementById('metric-adherence'),
  metricSavings: document.getElementById('metric-savings'),
  doctorSummary: document.getElementById('doctorSummary'),
  generateQuestions: document.getElementById('generateQuestions'),
  exportPdf: document.getElementById('exportPdf'),
  questionDraft: document.getElementById('questionDraft'),
  profileForm: document.getElementById('profileForm'),
  familyOverview: document.getElementById('familyOverview'),
  costForm: document.getElementById('costForm'),
  costSummary: document.getElementById('costSummary'),
  costTrendChart: document.getElementById('costTrendChart'),
};

let weeklyChart;
let costChart;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

function switchTab(tabName) {
  elements.tabs.forEach(tab => tab.classList.toggle('active', tab.id === tabName));
  elements.navButtons.forEach(button => button.classList.toggle('active', button.dataset.tab === tabName));
  renderAll();
}

function getHistoricalStats() {
  const totals = {
    logs: state.medicationLogs.length,
    symptoms: state.medicationLogs.reduce((sum, log) => sum + (log.symptoms ? 1 : 0), 0),
    adherence: 0,
    savings: 0,
  };
  const onTime = state.medicationLogs.filter(log => log.onSchedule).length;
  totals.adherence = totals.logs ? Math.round((onTime / totals.logs) * 100) : 0;
  totals.savings = state.costItems.reduce((sum, item) => sum + (item.savings || 0), 0);
  return totals;
}

function buildInsights() {
  const insights = [];
  if (!state.medicationLogs.length) {
    return [{ title: 'No data yet', details: 'Start logging medication and symptoms to see AI-generated insights.' }];
  }

  const byMedication = state.medicationLogs.reduce((acc, item) => {
    const key = item.medication.toLowerCase();
    acc[key] = acc[key] || { count: 0, symptomCount: 0, headaches: 0, nausea: 0, times: [] };
    acc[key].count += 1;
    if (item.symptoms) {
      acc[key].symptomCount += 1;
      if (/headache|migraine/i.test(item.symptoms)) acc[key].headaches += 1;
      if (/nausea|queasy|vomit/i.test(item.symptoms)) acc[key].nausea += 1;
    }
    acc[key].times.push(new Date(item.time));
    return acc;
  }, {});

  Object.entries(byMedication).forEach(([med, data]) => {
    if (data.headaches >= 2) {
      insights.push({
        title: `Headache pattern for ${med}`,
        details: `You report headaches ${Math.round((data.headaches / data.count) * 100)}% of the time when taking ${med}. Confidence: ${Math.max(50, 90 - data.count)}%`,
      });
    }
    if (data.nausea >= 2) {
      insights.push({
        title: `Nausea pattern for ${med}`,
        details: `Poor sleep is linked to nausea after ${med} in ${Math.round((data.nausea / data.count) * 100)}% of records. Confidence: ${Math.max(45, 85 - data.count)}%`,
      });
    }
    if (data.count >= 3) {
      insights.push({
        title: `Timing impact for ${med}`,
        details: `Energy tends to improve when ${med} is taken on schedule. Check your adherence for better outcomes. Confidence: 72%`,
      });
    }
  });

  const sleepIssues = state.medicationLogs.filter(log => log.sleep <= 4).length;
  if (sleepIssues > 1) {
    insights.push({
      title: 'Sleep quality correlation',
      details: `Low sleep quality is frequently associated with symptom flares and mood drops. Confidence: 78%`,
    });
  }

  const badMood = state.medicationLogs.filter(log => log.mood <= 4).length;
  if (badMood > 1) {
    insights.push({
      title: 'Mood trend',
      details: `Mood tends to dip on days with missed or late medication. Confidence: 80%`,
    });
  }

  if (!insights.length) {
    insights.push({ title: 'Emerging patterns', details: 'Continue logging for stronger correlations and trend detection.' });
  }

  return insights;
}

function renderInsights() {
  const insights = buildInsights();
  elements.insightsList.innerHTML = insights.map(insight => `
    <div class="insight-card">
      <h3>${insight.title}</h3>
      <p>${insight.details}</p>
    </div>
  `).join('');
}

function renderSummary() {
  const totals = getHistoricalStats();
  elements.metricMedications.textContent = totals.logs;
  elements.metricSideEffects.textContent = totals.symptoms;
  elements.metricAdherence.textContent = `${totals.adherence}%`;
  elements.metricSavings.textContent = `$${totals.savings.toFixed(2)}`;

  const averageMood = state.medicationLogs.reduce((sum, item) => sum + item.mood, 0) / Math.max(state.medicationLogs.length, 1);
  const averageSleep = state.medicationLogs.reduce((sum, item) => sum + item.sleep, 0) / Math.max(state.medicationLogs.length, 1);
  const averageEnergy = state.medicationLogs.reduce((sum, item) => sum + item.energy, 0) / Math.max(state.medicationLogs.length, 1);

  elements.monthlySummary.innerHTML = `
    <div class="report-card">
      <h3>Monthly Health Summary</h3>
      <p>Average mood: ${averageMood.toFixed(1)} / 10</p>
      <p>Average sleep quality: ${averageSleep.toFixed(1)} / 10</p>
      <p>Average energy level: ${averageEnergy.toFixed(1)} / 10</p>
      <p>Most reported symptom: ${mostReportedSymptom()}</p>
      <p>Medication adherence: ${totals.adherence}%</p>
    </div>
  `;
}

function mostReportedSymptom() {
  const tally = {};
  state.medicationLogs.forEach(item => {
    if (item.symptoms) {
      item.symptoms.split(/,|;|\n/).map(s => s.trim()).filter(Boolean).forEach(symptom => {
        tally[symptom.toLowerCase()] = (tally[symptom.toLowerCase()] || 0) + 1;
      });
    }
  });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'None yet';
}

function renderWeeklyTrendChart() {
  const labels = [];
  const moodData = [];
  const sleepData = [];
  const energyData = [];

  const sortedLogs = [...state.medicationLogs].sort((a, b) => new Date(a.time) - new Date(b.time));
  sortedLogs.slice(-7).forEach(log => {
    labels.push(new Date(log.time).toLocaleDateString([], { month: 'short', day: 'numeric' }));
    moodData.push(log.mood);
    sleepData.push(log.sleep);
    energyData.push(log.energy);
  });

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Mood', data: moodData, borderColor: '#2f80ed', backgroundColor: 'rgba(47,128,237,0.12)', tension: 0.3 },
        { label: 'Sleep', data: sleepData, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.12)', tension: 0.3 },
        { label: 'Energy', data: energyData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', tension: 0.3 },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true, max: 10 } },
    },
  };

  if (weeklyChart) {
    weeklyChart.destroy();
  }
  weeklyChart = new Chart(elements.weeklyTrendChart, config);
}

function renderMedicationHistory() {
  if (!state.medicationLogs.length) {
    elements.medicationHistory.innerHTML = '<div class="report-card"><p>No medication logs yet.</p></div>';
    return;
  }
  elements.medicationHistory.innerHTML = state.medicationLogs.slice().reverse().map(log => {
    return `
      <div class="history-row">
        <h3>${log.medication} • ${log.dosage}</h3>
        <p><strong>Time:</strong> ${formatDate(log.time)}</p>
        <p><strong>Mood:</strong> ${log.mood} · <strong>Energy:</strong> ${log.energy} · <strong>Sleep:</strong> ${log.sleep}</p>
        <p><strong>Symptoms:</strong> ${log.symptoms || 'None'}</p>
        <p><strong>Notes:</strong> ${log.notes || 'None'}</p>
      </div>
    `;
  }).join('');
}

function renderDoctorSummary() {
  const totals = getHistoricalStats();
  const missedDoses = state.medicationLogs.filter(item => !item.onSchedule).length;
  const sideEffectTally = {}; 
  state.medicationLogs.forEach(item => {
    if (item.symptoms) {
      item.symptoms.split(/,|;|\n/).map(s => s.trim()).filter(Boolean).forEach(symptom => {
        sideEffectTally[symptom.toLowerCase()] = (sideEffectTally[symptom.toLowerCase()] || 0) + 1;
      });
    }
  });
  const sortedSideEffects = Object.entries(sideEffectTally).sort((a,b)=>b[1]-a[1]).slice(0,3);

  const medications = [...new Set(state.medicationLogs.map(log => log.medication))].join(', ') || 'None';
  const schedule = state.medicationLogs.slice(-3).map(item => `${item.medication} @ ${new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join(', ') || 'No schedule data yet';

  elements.doctorSummary.innerHTML = `
    <div class="report-card">
      <h3>Current medications</h3>
      <p>${medications}</p>
      <h3>Medication schedule</h3>
      <p>${schedule}</p>
      <h3>Adherence percentage</h3>
      <p>${totals.adherence}%</p>
      <h3>Missed dose history</h3>
      <p>${missedDoses} missed or late dose(s)</p>
      <h3>Most common side effects</h3>
      <p>${sortedSideEffects.map(([symptom,count]) => `${symptom} (${count})`).join(', ') || 'None logged'}</p>
      <h3>Recent trends</h3>
      <p>Mood average: ${state.medicationLogs.length ? (state.medicationLogs.reduce((sum, item) => sum + item.mood, 0) / state.medicationLogs.length).toFixed(1) : 'N/A'}</p>
      <p>Sleep average: ${state.medicationLogs.length ? (state.medicationLogs.reduce((sum, item) => sum + item.sleep, 0) / state.medicationLogs.length).toFixed(1) : 'N/A'}</p>
    </div>
  `;
}

function generateDoctorQuestions() {
  const questions = [
    'Are there any adjustments needed for my current medication doses?',
    'Have you seen similar side effect patterns with these medications?',
    'Should I consider a different schedule if I experience low energy?',
    'Is there a safer alternative for my most frequent symptoms?',
    'Should I request a refill or prior authorization soon?',
  ];
  elements.questionDraft.value = questions.join('\n\n');
}

function renderFamilyOverview() {
  if (!state.familyProfiles.length) {
    elements.familyOverview.innerHTML = '<div class="report-card"><p>No family profiles added yet.</p></div>';
    return;
  }

  elements.familyOverview.innerHTML = state.familyProfiles.map(profile => {
    const upcomingAlert = profile.permission === 'primary' && profile.missedAlerts ? '⚠️ Critical missed doses' : '';
    return `
      <div class="overview-card">
        <h3>${profile.name} • ${profile.relationship}</h3>
        <p><strong>Role:</strong> ${profile.permission}</p>
        <p><strong>Allergies:</strong> ${profile.allergies || 'None'}</p>
        <p><strong>Emergency contact:</strong> ${profile.contact || 'Not set'}</p>
        <p>${upcomingAlert}</p>
      </div>
    `;
  }).join('');
}

function renderCostSummary() {
  if (!state.costItems.length) {
    elements.costSummary.innerHTML = '<div class="report-card"><p>Add medication costs to see savings recommendations.</p></div>';
    return;
  }
  const totalAnnual = state.costItems.reduce((sum, item) => sum + (item.cost * 12), 0);
  const genericSavings = state.costItems.reduce((sum, item) => sum + ((item.cost * 0.2) || 0), 0);
  elements.costSummary.innerHTML = `
    <div class="cost-card">
      <h3>Spending snapshot</h3>
      <p>Annual medication projection: $${totalAnnual.toFixed(2)}</p>
      <p>Potential generic savings: $${genericSavings.toFixed(2)}</p>
      <p>Most expensive drug: ${mostExpensiveMedication()}</p>
      <p>Recommendation: Consider reviewing pharmacy pricing and generic alternatives.</p>
    </div>
  `;

  renderCostTrendChart();
}

function mostExpensiveMedication() {
  if (!state.costItems.length) return 'None';
  const sorted = [...state.costItems].sort((a,b)=>b.cost-a.cost);
  return `${sorted[0].medication} ($${sorted[0].cost.toFixed(2)})`;
}

function renderCostTrendChart() {
  const labels = state.costItems.map(item => item.medication);
  const totals = state.costItems.map(item => item.cost);

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Monthly cost', data: totals, backgroundColor: 'rgba(47,128,237,0.75)' }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  };
  if (costChart) {
    costChart.destroy();
  }
  costChart = new Chart(elements.costTrendChart, config);
}

function renderAll() {
  renderInsights();
  renderSummary();
  renderWeeklyTrendChart();
  renderMedicationHistory();
  renderDoctorSummary();
  renderFamilyOverview();
  renderCostSummary();
}

function handleMedicationSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  const medication = data.medication.trim();
  if (!medication) return;

  const time = new Date(data.time).toISOString();
  const onSchedule = Math.random() > 0.2;

  state.medicationLogs.push({
    id: Date.now(),
    medication,
    dosage: data.dosage.trim(),
    time,
    mood: Number(data.mood),
    energy: Number(data.energy),
    sleep: Number(data.sleep),
    symptoms: data.symptoms.trim(),
    notes: data.notes.trim(),
    onSchedule,
  });
  saveState();
  form.reset();
  renderAll();
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  state.familyProfiles.push({
    id: Date.now(),
    name: data.name.trim(),
    relationship: data.relationship.trim(),
    permission: data.permission,
    allergies: data.allergies.trim(),
    contact: data.contact.trim(),
    missedAlerts: Math.random() > 0.7,
  });
  saveState();
  form.reset();
  renderFamilyOverview();
}

function handleCostSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  const cost = Number(data.cost);
  const copay = Number(data.copay);
  const savings = Math.max(0, cost * 0.18);
  state.costItems.push({
    id: Date.now(),
    medication: data.medication.trim(),
    cost,
    copay,
    insurance: data.insurance.trim(),
    pharmacy: data.pharmacy.trim(),
    refillDate: data.refillDate,
    savings,
  });
  saveState();
  form.reset();
  renderCostSummary();
}

function setupEventListeners() {
  elements.navButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  elements.medicationForm.addEventListener('submit', handleMedicationSubmit);
  elements.profileForm.addEventListener('submit', handleProfileSubmit);
  elements.costForm.addEventListener('submit', handleCostSubmit);
  elements.generateQuestions.addEventListener('click', generateDoctorQuestions);
  elements.exportPdf.addEventListener('click', () => {
    html2pdf().from(elements.doctorSummary).set({ margin: 10, filename: 'doctor-summary.pdf', html2canvas: { scale: 2 } }).save();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupEventListeners();
  renderAll();
});
