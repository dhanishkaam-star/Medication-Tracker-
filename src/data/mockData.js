export const initialUser = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  insurance: {
    provider: 'Aetna',
    memberId: '123456789',
    group: '987654',
  },
  doctor: {
    name: 'Dr. Smith',
    specialty: 'Cardiologist',
    phone: '(555) 123-4567',
  },
};

export const initialMedications = [
  {
    id: 'lisinopril',
    name: 'Lisinopril 10mg',
    dose: '1 tablet',
    time: '10:00 AM',
    quantity: '45 tablets',
    daysLeft: 15,
    refillDate: 'May 13',
    costSaver: '$3.00',
    pharmacy: 'CVS',
    takenToday: false,
    type: 'Prescription',
  },
  {
    id: 'metformin',
    name: 'Metformin 500mg',
    dose: '1 tablet',
    time: '8:00 AM',
    quantity: '120 tablets',
    daysLeft: 30,
    refillDate: 'May 28',
    costSaver: '$4.00',
    pharmacy: 'Walmart',
    takenToday: false,
    type: 'Prescription',
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin 20mg',
    dose: '1 tablet',
    time: '9:00 PM',
    quantity: '30 tablets',
    daysLeft: 10,
    refillDate: 'May 8',
    costSaver: '$5.00',
    pharmacy: 'Costco',
    takenToday: false,
    type: 'Prescription',
  },
  {
    id: 'vitamind',
    name: 'Vitamin D3 1000 IU',
    dose: '1 softgel',
    time: '8:00 AM',
    quantity: '60 softgels',
    daysLeft: 60,
    refillDate: 'Jun 7',
    costSaver: '$2.00',
    pharmacy: 'Target',
    takenToday: false,
    type: 'Supplement',
  },
];

export const symptoms = ['Mood', 'Sleep', 'Energy', 'Pain', 'Other'];

export const familyMembers = [
  { id: 'john', name: 'John Doe', role: 'Primary Account' },
  { id: 'mary', name: 'Mary Doe', role: 'Mom, Age 68' },
  { id: 'alex', name: 'Alex Doe', role: 'Son, Age 12' },
];

export const calendarEvents = [
  { id: 'cal-1', title: 'Metformin 500mg', time: '8:00 AM', type: 'Medication', frequency: 'Daily' },
  { id: 'cal-2', title: 'Lisinopril 10mg Refill Due', time: 'May 13', type: 'Refill' },
  { id: 'cal-3', title: 'Dr. Smith Appointment', time: 'May 23', type: 'Doctor' },
];

export const insightSummary = {
  pattern: 'You report headaches 80% of the time at 2 PM.',
  missedDoses: 2,
  sideEffects: 5,
  questions: 3,
  adherence: 86,
  missedPercent: 10,
  unknownPercent: 4,
};
