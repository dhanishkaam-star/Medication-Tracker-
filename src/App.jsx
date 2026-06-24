import React, { useMemo, useState } from 'react';
import { ArrowLeft, Bell, CheckCircle2, Globe, Plus, ShieldCheck, Sparkles, User, Users, CalendarDays, Activity, Heart, ChevronRight, Settings } from 'lucide-react';
import BottomNav from './components/BottomNav.jsx';
import ProgressSteps from './components/ProgressSteps.jsx';
import MedicationRow from './components/MedicationRow.jsx';
import SymptomButton from './components/SymptomButton.jsx';
import QuickActionCard from './components/QuickActionCard.jsx';
import CalendarView from './components/CalendarView.jsx';
import { initialUser, initialMedications, symptoms, familyMembers, calendarEvents, insightSummary } from './data/mockData.js';

const tabs = ['home', 'shelf', 'calendar', 'insights', 'profile'];

const onboardingCards = [
  { id: 'me', label: 'Me', subtitle: 'It’s for me', icon: User },
  { id: 'family', label: 'Family Member', subtitle: 'It’s for a family member', icon: Users },
  { id: 'friend', label: 'Friend / Care Recipient', subtitle: 'It’s for a friend or someone I care for', icon: Heart },
];

const calendarTabs = ['Month', 'Week', 'Agenda'];

export default function App() {
  const [hasAccount, setHasAccount] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [authChoice, setAuthChoice] = useState('email');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [accountFor, setAccountFor] = useState('me');
  const [personalInfo, setPersonalInfo] = useState({ name: '', dob: '', gender: '' });
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', emergency: '' });
  const [historyInfo, setHistoryInfo] = useState({ conditions: '', surgeries: '', allergies: '' });
  const [medForm, setMedForm] = useState({ name: '', dosage: '', frequency: '', time: '', quantity: '', refill: '', pharmacy: '', cost: '' });
  const [user, setUser] = useState(initialUser);
  const [medications, setMedications] = useState(initialMedications);
  const [activeSymptom, setActiveSymptom] = useState('Mood');
  const [activeTab, setActiveTab] = useState('home');
  const [calendarTab, setCalendarTab] = useState('Month');
  const [selectedFamily, setSelectedFamily] = useState('john');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showDoseModal, setShowDoseModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [newDependent, setNewDependent] = useState({ name: '', relationship: '', dob: '', notes: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [hasLoggedInOnce, setHasLoggedInOnce] = useState(false);
  const [familyList, setFamilyList] = useState(familyMembers);
  const [selectedDoseId, setSelectedDoseId] = useState('lisinopril');
  const [selectedRefillId, setSelectedRefillId] = useState('lisinopril');

  const passwordValid = useMemo(() => {
    const value = passwords.password;
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
      match: value === passwords.confirm && value.length > 0,
    };
  }, [passwords]);

  const hasAllPasswordChecks = Object.values(passwordValid).every(Boolean);
  const returningUser = hasAccount && hasLoggedInOnce;

  const activeUserName = personalInfo.name || user.name;

  const handleContinueOnboarding = () => {
    if (onboardingStep === 1) {
      setOnboardingStep(2);
      return;
    }
    if (onboardingStep === 2) {
      setOnboardingStep(3);
      return;
    }
    if (onboardingStep === 3) {
      setOnboardingStep(4);
      return;
    }
    if (onboardingStep === 4) {
      setOnboardingStep(5);
      return;
    }
    if (onboardingStep === 5) {
      setOnboardingStep(6);
      return;
    }
  };

  const handleCreateAccount = () => {
    setHasAccount(true);
    setCurrentScreen('passwordSetup');
  };

  const handleSignIn = () => {
    setCurrentScreen('loginPassword');
  };

  const handleStartTracking = () => {
    setHasLoggedInOnce(true);
    setCurrentScreen('main');
    setActiveTab('home');
  };

  const handlePasswordSubmit = () => {
    if (!returningUser) {
      if (!hasAllPasswordChecks) {
        setErrorText('Please complete the password requirements.');
        return;
      }
      setErrorText('');
      setCurrentScreen('accountCreated');
    } else {
      if (!currentPassword) {
        setErrorText('Please enter your password.');
        return;
      }
      setErrorText('');
      handleStartTracking();
    }
  };

  const handleToggleMedication = (id) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, takenToday: !med.takenToday } : med)));
  };

  const handleLogDose = (id) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, takenToday: true } : med)));
    setShowDoseModal(false);
  };

  const handleAddMedication = () => {
    if (!medForm.name || !medForm.dosage || !medForm.time) {
      return;
    }
    const newMed = {
      id: medForm.name.toLowerCase().replace(/\s+/g, '-'),
      name: medForm.name,
      dose: medForm.dosage,
      time: medForm.time,
      quantity: medForm.quantity || '30 tablets',
      daysLeft: 30,
      refillDate: medForm.refill || 'Jun 1',
      costSaver: medForm.cost || '$0.00',
      pharmacy: medForm.pharmacy || 'Local Pharmacy',
      takenToday: false,
    };
    setMedications((prev) => [newMed, ...prev]);
    setShowAddMedModal(false);
    setMedForm({ name: '', dosage: '', frequency: '', time: '', quantity: '', refill: '', pharmacy: '', cost: '' });
  };

  const handleSaveRefill = () => {
    setShowRefillModal(false);
  };

  const handleAddDependent = () => {
    if (!newDependent.name) return;
    setFamilyList((prev) => [...prev, { id: newDependent.name.toLowerCase().replace(/\s+/g, '-'), name: newDependent.name, role: `${newDependent.relationship} ${newDependent.dob ? ', Age ' + newDependent.dob.split('-')[0] : ''}` }]);
    setShowDependentModal(false);
    setNewDependent({ name: '', relationship: '', dob: '', notes: '' });
  };

  const homeMedication = medications.find((med) => med.id === 'lisinopril') || medications[0];

  const renderWelcome = () => (
    <main className="screen-container">
      <div className="screen-content welcome-screen">
        <div className="hero-card">
          <div className="hero-icon">S</div>
          <h1>SynapseAI</h1>
          <p className="hero-subtitle">Medication Tracker</p>
          <div className="hero-illustration">
            <div className="pill-shape" />
            <div className="bottle-shape" />
          </div>
          <h2>Smarter tracking. Better health.</h2>
          <p>Track your medications, understand your health, and never miss a dose.</p>
        </div>
        <button className="button button-primary hero-button" onClick={() => setCurrentScreen('authChoice')}>Get Started</button>
      </div>
    </main>
  );

  const renderAuthChoice = () => (
    <main className="screen-container">
      <div className="screen-content auth-screen">
        <div className="auth-header">
          <h1>Welcome</h1>
          <p>Sign in to continue your health journey.</p>
        </div>
        <div className="auth-buttons">
          <button className="button button-secondary" onClick={() => { setAuthChoice('email'); handleSignIn(); }}>Sign in with Email</button>
          <button className="button button-secondary" onClick={() => { setAuthChoice('phone'); handleSignIn(); }}>Sign in with Phone</button>
        </div>
        <div className="auth-footer">
          <p>New to SynapseAI? <button className="link-button" onClick={() => { setCurrentScreen('onboarding'); setOnboardingStep(1); }}>Create Account</button></p>
        </div>
      </div>
    </main>
  );

  const renderOnboarding = () => (
    <main className="screen-container">
      <div className="screen-content onboarding-screen">
        <div className="onboarding-header">
          <button className="icon-button" onClick={() => setCurrentScreen('authChoice')}><ArrowLeft size={18} /></button>
          <ProgressSteps step={onboardingStep} />
        </div>
        <div className="onboarding-body">
          {onboardingStep === 1 && (
            <>
              <h1>Who is this account being set up for?</h1>
              <p>This helps us personalize the experience.</p>
              <div className="onboarding-card-grid">
                {onboardingCards.map((card) => {
                  const Icon = card.icon;
                  const active = accountFor === card.id;
                  return (
                    <button key={card.id} className={`select-card ${active ? 'active' : ''}`} onClick={() => setAccountFor(card.id)}>
                      <div className="select-card-icon"><Icon size={20} /></div>
                      <strong>{card.label}</strong>
                      <p>{card.subtitle}</p>
                    </button>
                  );
                })}
              </div>
              <button className="button button-primary" onClick={handleContinueOnboarding}>Continue</button>
            </>
          )}
          {onboardingStep === 2 && (
            <>
              <h1>Let’s get to know you</h1>
              <p>Basic information to get started.</p>
              <div className="form-grid">
                <label className="input-group"><span>Full Name</span><input type="text" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} placeholder="Enter your full name" /></label>
                <label className="input-group"><span>Date of Birth</span><input type="date" value={personalInfo.dob} onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })} /></label>
                <label className="input-group"><span>Gender</span><select value={personalInfo.gender} onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}><option value="">Select gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
              </div>
              <button className="button button-primary" onClick={handleContinueOnboarding}>Next</button>
            </>
          )}
          {onboardingStep === 3 && (
            <>
              <h1>Contact Information</h1>
              <p>How can we reach you?</p>
              <div className="form-grid">
                <label className="input-group"><span>Email Address</span><input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="Enter your email" /></label>
                <label className="input-group"><span>Phone Number</span><input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder="Enter your phone number" /></label>
                <label className="input-group"><span>Emergency Contact</span><input type="text" value={contactInfo.emergency} onChange={(e) => setContactInfo({ ...contactInfo, emergency: e.target.value })} placeholder="Enter emergency contact" /></label>
              </div>
              <button className="button button-primary" onClick={handleContinueOnboarding}>Next</button>
            </>
          )}
          {onboardingStep === 4 && (
            <>
              <h1>Medical History</h1>
              <p>Help us understand your health better.</p>
              <div className="form-grid">
                <label className="input-group"><span>Chronic conditions</span><input type="text" value={historyInfo.conditions} onChange={(e) => setHistoryInfo({ ...historyInfo, conditions: e.target.value })} placeholder="Search or select conditions" /></label>
                <label className="input-group"><span>Past surgeries</span><input type="text" value={historyInfo.surgeries} onChange={(e) => setHistoryInfo({ ...historyInfo, surgeries: e.target.value })} placeholder="Enter past surgeries" /></label>
                <label className="input-group"><span>Known allergies</span><input type="text" value={historyInfo.allergies} onChange={(e) => setHistoryInfo({ ...historyInfo, allergies: e.target.value })} placeholder="Enter allergies" /></label>
              </div>
              <p className="helper-text">You can add more later in your profile.</p>
              <button className="button button-primary" onClick={handleContinueOnboarding}>Next</button>
            </>
          )}
          {onboardingStep === 5 && (
            <>
              <h1>Current Medications</h1>
              <p>Add medications you are currently taking.</p>
              <div className="form-grid">
                <label className="input-group"><span>Medication Name</span><input type="text" value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} placeholder="Enter medication name" /></label>
                <label className="input-group"><span>Dosage</span><input type="text" value={medForm.dosage} onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })} placeholder="Example: 10mg" /></label>
                <label className="input-group"><span>Frequency</span><input type="text" value={medForm.frequency} onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })} placeholder="Example: Once daily" /></label>
                <label className="input-group"><span>Time of Dose</span><input type="time" value={medForm.time} onChange={(e) => setMedForm({ ...medForm, time: e.target.value })} /></label>
                <label className="input-group"><span>Number of pills/tablets left</span><input type="text" value={medForm.quantity} onChange={(e) => setMedForm({ ...medForm, quantity: e.target.value })} placeholder="Example: 30 tablets" /></label>
                <label className="input-group"><span>Refill date</span><input type="date" value={medForm.refill} onChange={(e) => setMedForm({ ...medForm, refill: e.target.value })} /></label>
                <label className="input-group"><span>Pharmacy</span><input type="text" value={medForm.pharmacy} onChange={(e) => setMedForm({ ...medForm, pharmacy: e.target.value })} placeholder="Pharmacy name" /></label>
                <label className="input-group"><span>Copay/cost</span><input type="text" value={medForm.cost} onChange={(e) => setMedForm({ ...medForm, cost: e.target.value })} placeholder="Example: $10" /></label>
              </div>
              {medForm.name && (
                <div className="review-med">
                  <h3>Medication preview</h3>
                  <p>{medForm.name} · {medForm.dosage} · {medForm.time || 'Time not set'}</p>
                </div>
              )}
              {medications.length === 0 && <p className="helper-text">No medications added yet. You can add them now or skip this step.</p>}
              <div className="onboarding-actions">
                <button className="button button-secondary" onClick={() => { setOnboardingStep(6); }}>Skip</button>
                <button className="button button-primary" onClick={() => { handleAddMedication(); handleContinueOnboarding(); }}>Add Medication</button>
              </div>
            </>
          )}
          {onboardingStep === 6 && (
            <>
              <h1>Review & Confirm</h1>
              <p>Please review your information before continuing.</p>
              <div className="review-cards">
                <div className="review-card"><strong>Account For</strong><p>{onboardingCards.find((card) => card.id === accountFor)?.label}</p></div>
                <div className="review-card"><strong>Personal Information</strong><p>{personalInfo.name || 'John Doe'}</p><p>{personalInfo.dob || 'DOB not set'}</p><p>{personalInfo.gender || 'Gender not set'}</p></div>
                <div className="review-card"><strong>Contact Information</strong><p>{contactInfo.email || 'Email not set'}</p><p>{contactInfo.phone || 'Phone not set'}</p><p>{contactInfo.emergency || 'Emergency contact not set'}</p></div>
                <div className="review-card"><strong>Medical Summary</strong><p>{historyInfo.conditions || 'No conditions added'}</p><p>{historyInfo.allergies || 'No allergies added'}</p><p>{historyInfo.surgeries || 'No surgeries added'}</p></div>
                <div className="review-card"><strong>Current Medications</strong><p>{medications.length} medications added</p></div>
              </div>
              <button className="button button-primary" onClick={handleCreateAccount}>Create My Account</button>
            </>
          )}
        </div>
      </div>
    </main>
  );

  const renderPasswordSetup = () => (
    <main className="screen-container">
      <div className="screen-content auth-screen">
        <h1>Set Your Password</h1>
        <p>Create a secure password to protect your account.</p>
        <div className="form-grid">
          <label className="input-group"><span>Password</span><div className="password-field"><input type={passwordVisible ? 'text' : 'password'} value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} placeholder="Password" /><button type="button" className="icon-button" onClick={() => setPasswordVisible((prev) => !prev)}>{passwordVisible ? 'Hide' : 'Show'}</button></div></label>
          <label className="input-group"><span>Confirm Password</span><div className="password-field"><input type={passwordVisible ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Confirm password" /><button type="button" className="icon-button" onClick={() => setPasswordVisible((prev) => !prev)}>{passwordVisible ? 'Hide' : 'Show'}</button></div></label>
        </div>
        <div className="password-checklist">
          <p className={passwordValid.length ? 'valid' : ''}>At least 8 characters</p>
          <p className={passwordValid.upper ? 'valid' : ''}>One uppercase letter</p>
          <p className={passwordValid.lower ? 'valid' : ''}>One lowercase letter</p>
          <p className={passwordValid.number ? 'valid' : ''}>One number</p>
          <p className={passwordValid.special ? 'valid' : ''}>One special character</p>
        </div>
        {errorText && <p className="error-text">{errorText}</p>}
        <button className="button button-primary" onClick={handlePasswordSubmit}>Next</button>
      </div>
    </main>
  );

  const renderAccountCreated = () => (
    <main className="screen-container">
      <div className="screen-content success-screen">
        <div className="success-card">
          <ShieldCheck size={36} className="success-icon" />
          <h1>Account Created!</h1>
          <p>Your account has been created successfully.</p>
        </div>
        <button className="button button-primary" onClick={handleStartTracking}>Start Tracking</button>
      </div>
    </main>
  );

  const renderLoginPassword = () => (
    <main className="screen-container">
      <div className="screen-content auth-screen">
        <h1>Enter Password</h1>
        <p>Enter your password to continue.</p>
        <div className="form-grid">
          <label className="input-group"><span>Password</span><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Password" /></label>
        </div>
        <div className="link-row"><button className="link-button">Forgot Password?</button></div>
        {errorText && <p className="error-text">{errorText}</p>}
        <button className="button button-primary" onClick={handlePasswordSubmit}>Sign In</button>
      </div>
    </main>
  );

  const renderHome = () => (
    <main className="main-screen">
      <div className="page-header">
        <div>
          <div className="logo-pill"><Sparkles size={18} /></div>
          <h2>Good morning, {activeUserName}</h2>
          <p>Here’s your medication overview for today.</p>
        </div>
        <button className="icon-button notification-button"><Bell size={20} /></button>
      </div>
      <section className="section-card highlight-card">
        <div className="section-card-top">
          <div>
            <p className="section-label">Upcoming Medication</p>
            <h3>{homeMedication.name}</h3>
            <p>{homeMedication.dose} · {homeMedication.time}</p>
          </div>
          <div className="pill-badge"><Heart size={18} /></div>
        </div>
        <div className="section-card-action">
          <button className="button button-secondary" onClick={() => handleLogDose(homeMedication.id)}>{homeMedication.takenToday ? 'Taken' : 'Log Dose'}</button>
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading"><h3>Today’s Medications</h3></div>
        <div className="card-list">
          {medications.map((item) => (<MedicationRow key={item.id} item={item} onToggle={handleToggleMedication} />))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading"><h3>Log Symptoms</h3></div>
        <div className="symptom-grid">
          {symptoms.map((symptom) => (<SymptomButton key={symptom} label={symptom} active={activeSymptom === symptom} onClick={() => setActiveSymptom(symptom)} />))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading"><h3>Quick Actions</h3></div>
        <div className="quick-grid">
          <QuickActionCard title="Add Medication" subtitle="Add a new medication" onClick={() => setShowAddMedModal(true)} />
          <QuickActionCard title="Log Dose" subtitle="Mark medication taken" onClick={() => setShowDoseModal(true)} />
          <QuickActionCard title="Refill" subtitle="Plan your next refill" onClick={() => setShowRefillModal(true)} />
        </div>
      </section>
    </main>
  );

  const renderShelf = () => (
    <main className="main-screen">
      <div className="page-header page-with-action">
        <div>
          <h2>Shelf</h2>
          <p>Manage medications for your family in one place.</p>
        </div>
        <button className="button button-primary" onClick={() => setShowAddMedModal(true)}><Plus size={16} /> Add</button>
      </div>
      <section className="card-list">
        {medications.map((med) => (
          <div key={med.id} className="shelf-card">
            <div className="shelf-card-top">
              <h3>{med.name}</h3>
              <span>{med.dose}</span>
            </div>
            <p>{med.quantity} · {med.daysLeft} days left</p>
            <p>Refill by {med.refillDate}</p>
            <div className="shelf-card-footer">
              <span className="cost-tag">Cost Saver {med.costSaver}</span>
              <span>{med.pharmacy}</span>
            </div>
            <div className="shelf-card-notes">Generic alternatives • Coupon available • Lower cost nearby</div>
          </div>
        ))}
      </section>
    </main>
  );

  const renderCalendar = () => (
    <main className="main-screen">
      <div className="page-header page-with-action">
        <div>
          <h2>Calendar</h2>
          <p>Track your medication and appointments.</p>
        </div>
        <button className="icon-button"><Plus size={18} /></button>
      </div>
      <div className="calendar-tabs">
        {calendarTabs.map((tab) => (<button key={tab} className={`calendar-tab ${calendarTab === tab ? 'active' : ''}`} onClick={() => setCalendarTab(tab)}>{tab}</button>))}
      </div>
      {calendarTab === 'Month' ? (
        <CalendarView month={4} year={2025} events={calendarEvents} />
      ) : (
        <div className="calendar-placeholder"><p>{calendarTab} view coming soon.</p></div>
      )}
      <div className="upcoming-list">
        <h3>Upcoming</h3>
        <div className="upcoming-card"><div><strong>Metformin 500mg</strong><p>8:00 AM · Daily</p></div></div>
        <div className="upcoming-card"><div><strong>Lisinopril 10mg Refill Due</strong><p>May 13 · Refill by May 13</p></div></div>
        <div className="upcoming-card"><div><strong>Dr. Smith Appointment</strong><p>May 23 · Cardiology Check-up</p></div></div>
      </div>
    </main>
  );

  const renderInsights = () => (
    <main className="main-screen">
      <div className="page-header"><h2>Insights</h2><p>Understand how medications and symptoms connect.</p></div>
      <section className="insight-card">
        <div className="insight-title"><h3>Side Effect Pattern Tracking</h3><p>This can help you discuss patterns with your doctor.</p></div>
        <p className="insight-highlight">{insightSummary.pattern}</p>
        <div className="insight-tags"><span>Medications</span><span>Symptoms</span><span>Mood</span><span>Sleep</span><span>Energy</span></div>
      </section>
      <section className="insight-card">
        <div className="insight-title"><h3>Doctor Visit Preparation</h3><p>Prepare a quick summary for your next appointment.</p></div>
        <div className="report-grid">
          <div><strong>Missed Doses</strong><p>{insightSummary.missedDoses}</p></div>
          <div><strong>Side Effects Logged</strong><p>{insightSummary.sideEffects}</p></div>
          <div><strong>Questions to Ask</strong><p>{insightSummary.questions}</p></div>
          <div><strong>Medication Adherence</strong><p>{insightSummary.adherence}%</p></div>
        </div>
        <button className="button button-secondary" onClick={() => alert('Doctor summary PDF generated.')}>Export PDF</button>
      </section>
      <section className="insight-card small-card">
        <div className="insight-title"><h3>Medication Adherence</h3></div>
        <div className="progress-ring"><div className="progress-inner"><strong>{insightSummary.adherence}%</strong><p>On Track</p></div></div>
        <div className="adherence-row"><span>Missed {insightSummary.missedPercent}%</span><span>Unknown {insightSummary.unknownPercent}%</span></div>
      </section>
    </main>
  );

  const renderProfile = () => (
    <main className="main-screen profile-screen">
      <div className="page-header page-with-action">
        <div>
          <h2>Profile</h2>
          <p>Manage your account and family care settings.</p>
        </div>
        <button className="icon-button"><Globe size={18} /></button>
      </div>
      <section className="profile-card">
        <div className="profile-avatar">J</div>
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <button className="icon-button"><Settings size={18} /></button>
      </section>
      <section className="profile-section">
        <div className="section-heading"><h3>Family Medication Dashboard</h3></div>
        {familyList.map((member) => (
          <button key={member.id} className={`family-row ${selectedFamily === member.id ? 'active' : ''}`} onClick={() => setSelectedFamily(member.id)}>
            <div>
              <strong>{member.name}</strong>
              <p>{member.role}</p>
            </div>
            {selectedFamily === member.id && <CheckCircle2 size={18} />}
          </button>
        ))}
        <button className="button button-secondary" onClick={() => setShowDependentModal(true)}>+ Add Dependent</button>
      </section>
      <section className="profile-section">
        <div className="section-heading"><h3>Doctors & Contacts</h3></div>
        <div className="info-card"><strong>{user.doctor.name}</strong><p>{user.doctor.specialty}</p><p>{user.doctor.phone}</p></div>
      </section>
      <section className="profile-section">
        <div className="section-heading"><h3>Insurance</h3></div>
        <div className="info-card"><p>Provider: {user.insurance.provider}</p><p>Member ID: {user.insurance.memberId}</p><p>Group: {user.insurance.group}</p></div>
      </section>
      <section className="profile-section">
        <div className="section-heading"><h3>Settings</h3></div>
        {['Notifications', 'Password & Security', 'Privacy', 'Help & Support'].map((row) => (
          <div key={row} className="settings-row"><span>{row}</span><ChevronRight size={18} /></div>
        ))}
      </section>
    </main>
  );

  const renderModal = () => {
    if (!showAddMedModal && !showDoseModal && !showRefillModal && !showDependentModal) {
      return null;
    }
    return (
      <div className="modal-overlay" onClick={() => { setShowAddMedModal(false); setShowDoseModal(false); setShowRefillModal(false); setShowDependentModal(false); }}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {showAddMedModal && (
            <>
              <div className="modal-header"><h3>Add Medication</h3><button className="icon-button" onClick={() => setShowAddMedModal(false)}>×</button></div>
              <div className="form-grid">
                <label className="input-group"><span>Medication name</span><input value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} placeholder="Medication name" /></label>
                <label className="input-group"><span>Dosage</span><input value={medForm.dosage} onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })} placeholder="Dosage" /></label>
                <label className="input-group"><span>Time</span><input type="time" value={medForm.time} onChange={(e) => setMedForm({ ...medForm, time: e.target.value })} /></label>
                <label className="input-group"><span>Frequency</span><input value={medForm.frequency} onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })} placeholder="Frequency" /></label>
                <label className="input-group"><span>Quantity left</span><input value={medForm.quantity} onChange={(e) => setMedForm({ ...medForm, quantity: e.target.value })} placeholder="Quantity left" /></label>
                <label className="input-group"><span>Refill date</span><input type="date" value={medForm.refill} onChange={(e) => setMedForm({ ...medForm, refill: e.target.value })} /></label>
                <label className="input-group"><span>Pharmacy</span><input value={medForm.pharmacy} onChange={(e) => setMedForm({ ...medForm, pharmacy: e.target.value })} placeholder="Pharmacy" /></label>
                <label className="input-group"><span>Cost/copay</span><input value={medForm.cost} onChange={(e) => setMedForm({ ...medForm, cost: e.target.value })} placeholder="$0.00" /></label>
              </div>
              <div className="modal-actions"><button className="button button-secondary" onClick={() => setShowAddMedModal(false)}>Cancel</button><button className="button button-primary" onClick={handleAddMedication}>Save Medication</button></div>
            </>
          )}
          {showDoseModal && (
            <>
              <div className="modal-header"><h3>Log Dose</h3><button className="icon-button" onClick={() => setShowDoseModal(false)}>×</button></div>
              <div className="select-list">
                {medications.map((med) => (
                  <button key={med.id} className={`select-item ${selectedDoseId === med.id ? 'selected' : ''}`} onClick={() => setSelectedDoseId(med.id)}>{med.name}</button>
                ))}
              </div>
              <button className="button button-primary" onClick={() => handleLogDose(selectedDoseId)}>Mark as Taken</button>
            </>
          )}
          {showRefillModal && (
            <>
              <div className="modal-header"><h3>Refill Reminder</h3><button className="icon-button" onClick={() => setShowRefillModal(false)}>×</button></div>
              <div className="form-grid">
                <label className="input-group"><span>Select medication</span><select value={selectedRefillId} onChange={(e) => setSelectedRefillId(e.target.value)}>{medications.map((med) => (<option key={med.id} value={med.id}>{med.name}</option>))}</select></label>
                <label className="input-group"><span>Refill date</span><input type="date" /></label>
                <label className="input-group"><span>Pharmacy</span><input placeholder="Pharmacy" /></label>
                <label className="input-group"><span>Cost</span><input placeholder="$0.00" /></label>
              </div>
              <div className="cost-suggestions"><strong>Cost Saver</strong><p>Generic available • Coupon found • Lower cost nearby</p></div>
              <button className="button button-primary" onClick={handleSaveRefill}>Save Refill Reminder</button>
            </>
          )}
          {showDependentModal && (
            <>
              <div className="modal-header"><h3>Add Dependent</h3><button className="icon-button" onClick={() => setShowDependentModal(false)}>×</button></div>
              <div className="form-grid">
                <label className="input-group"><span>Full name</span><input value={newDependent.name} onChange={(e) => setNewDependent({ ...newDependent, name: e.target.value })} placeholder="Full name" /></label>
                <label className="input-group"><span>Relationship</span><input value={newDependent.relationship} onChange={(e) => setNewDependent({ ...newDependent, relationship: e.target.value })} placeholder="Relationship" /></label>
                <label className="input-group"><span>Date of birth</span><input type="date" value={newDependent.dob} onChange={(e) => setNewDependent({ ...newDependent, dob: e.target.value })} /></label>
                <label className="input-group"><span>Notes</span><textarea value={newDependent.notes} onChange={(e) => setNewDependent({ ...newDependent, notes: e.target.value })} placeholder="Notes" rows="3" /></label>
              </div>
              <button className="button button-primary" onClick={handleAddDependent}>Add Dependent</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <div className="app-frame">
        {!hasAccount && currentScreen === 'welcome' && renderWelcome()}
        {!hasAccount && currentScreen === 'authChoice' && renderAuthChoice()}
        {!hasAccount && currentScreen === 'onboarding' && renderOnboarding()}
        {hasAccount && currentScreen === 'passwordSetup' && renderPasswordSetup()}
        {hasAccount && currentScreen === 'accountCreated' && renderAccountCreated()}
        {hasAccount && currentScreen === 'loginPassword' && renderLoginPassword()}
        {hasAccount && currentScreen === 'main' && (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'shelf' && renderShelf()}
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'insights' && renderInsights()}
            {activeTab === 'profile' && renderProfile()}
            <BottomNav activeTab={activeTab} onChange={setActiveTab} />
          </>
        )}
        {showAddMedModal || showDoseModal || showRefillModal || showDependentModal ? renderModal() : null}
      </div>
    </div>
  );
}
