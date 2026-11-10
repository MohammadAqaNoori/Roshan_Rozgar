/**
 * Static data — categories, skills, areas, avatar looks, seed workers, customer.
 */

export const CATS = [
  { id: 'plumber', en: 'Plumber', ur: 'پلمبر', icon: 'droplet', hint: 'Leaks, taps, geysers' },
  { id: 'electrician', en: 'Electrician', ur: 'الیکٹریشن', icon: 'zap', hint: 'Wiring, fans, UPS' },
  { id: 'ac', en: 'AC Technician', ur: 'اے سی مکینک', icon: 'snow', hint: 'Service, gas, install' },
  { id: 'carpenter', en: 'Carpenter', ur: 'بڑھئی', icon: 'hammer', hint: 'Doors, cupboards' },
  { id: 'painter', en: 'Painter', ur: 'پینٹر', icon: 'brush', hint: 'Rooms, seepage' },
  { id: 'mechanic', en: 'Mechanic', ur: 'مکینک', icon: 'car', hint: 'Car & bike' },
  { id: 'appliance', en: 'Appliance Repair', ur: 'مشین مرمت', icon: 'washer', hint: 'Fridge, washing machine' },
  { id: 'general', en: 'General Repair', ur: 'عام مرمت', icon: 'wrench', hint: 'Odd jobs at home' },
];

export const catBy = (id) => CATS.find((c) => c.id === id) || CATS[0];

export const SKILLS = {
  plumber: [['Leak repair', 'لیکیج ٹھیک کرنا', 'droplet'], ['Tap & mixer', 'نلکا اور مکسر', 'wrench'], ['Geyser fitting', 'گیزر فٹنگ', 'sun'], ['Pipe replacement', 'پائپ بدلنا', 'route'], ['Bathroom fittings', 'باتھ روم فٹنگ', 'home'], ['Water tank & pump', 'ٹینکی اور موٹر', 'droplet']],
  electrician: [['House wiring', 'گھر کی وائرنگ', 'zap'], ['Fan & light', 'پنکھا اور لائٹ', 'sun'], ['UPS & inverter', 'یو پی ایس', 'zap'], ['Switchboard', 'سوئچ بورڈ', 'layout'], ['Fault finding', 'خرابی ڈھونڈنا', 'search'], ['Meter & DB', 'میٹر اور ڈی بی', 'briefcase']],
  ac: [['AC service', 'اے سی سروس', 'snow'], ['Gas refill', 'گیس بھرنا', 'snow'], ['Installation', 'فٹنگ', 'wrench'], ['PCB repair', 'کارڈ مرمت', 'zap']],
  carpenter: [['Door repair', 'دروازہ مرمت', 'home'], ['Cupboards', 'الماری', 'layout'], ['Furniture polish', 'پالش', 'brush'], ['Locks & hinges', 'تالے اور قبضے', 'lock']],
  painter: [['Room paint', 'کمرے کا رنگ', 'brush'], ['Seepage fix', 'سیلن کا علاج', 'droplet'], ['Exterior', 'باہر کی دیوار', 'home'], ['Polish & enamel', 'پالش', 'brush']],
  mechanic: [['Car service', 'گاڑی سروس', 'car'], ['Bike repair', 'بائیک مرمت', 'car'], ['Battery', 'بیٹری', 'zap'], ['Denting', 'ڈینٹنگ', 'hammer']],
  appliance: [['Fridge', 'فریج', 'washer'], ['Washing machine', 'واشنگ مشین', 'washer'], ['Microwave', 'مائیکروویو', 'zap'], ['Water dispenser', 'ڈسپنسر', 'droplet']],
  general: [['Drilling & fixing', 'ڈرل اور فٹنگ', 'wrench'], ['Curtain rods', 'پردے کی راڈ', 'home'], ['Furniture assembly', 'فرنیچر جوڑنا', 'hammer'], ['Small repairs', 'چھوٹی مرمت', 'wrench']],
};

export const AREAS = [
  { id: 'G-11', city: 'Islamabad', x: 250, y: 250 },
  { id: 'G-10', city: 'Islamabad', x: 330, y: 250 },
  { id: 'G-9', city: 'Islamabad', x: 410, y: 250 },
  { id: 'F-11', city: 'Islamabad', x: 250, y: 170 },
  { id: 'F-10', city: 'Islamabad', x: 330, y: 170 },
  { id: 'I-8', city: 'Islamabad', x: 470, y: 330 },
  { id: 'G-13', city: 'Islamabad', x: 110, y: 250 },
  { id: 'Saddar', city: 'Rawalpindi', x: 560, y: 420 },
  { id: 'Satellite Town', city: 'Rawalpindi', x: 600, y: 360 },
];

export const LOOKS = {
  imran: { skin: '#B97A56', shirt: '#087F5B', hair: 'short', beard: true, bg: '#E3F2EC', hc: '#2A1D16' },
  rehman: { skin: '#A86B48', shirt: '#F4B942', hair: 'cap', beard: true, bg: '#FEF7E6', hc: '#3A2A20', cap: '#07513D' },
  shahid: { skin: '#C68A63', shirt: '#3E6FB0', hair: 'short', beard: false, bg: '#E8EEF8', hc: '#1E1612' },
  naveed: { skin: '#9C6444', shirt: '#8A5A3B', hair: 'topi', beard: true, bg: '#F4ECE4', hc: '#BFB7B0' },
  zahid: { skin: '#B5764F', shirt: '#D94848', hair: 'short', beard: false, bg: '#FCEDED', hc: '#241914' },
  bilal: { skin: '#C9906A', shirt: '#07513D', hair: 'short', beard: true, bg: '#E3F2EC', hc: '#2B1E17' },
  tariq: { skin: '#A96F4C', shirt: '#5E6A66', hair: 'cap', beard: false, bg: '#F0F2F1', hc: '#2A1D16', cap: '#D94848' },
  asif: { skin: '#B47450', shirt: '#202B29', hair: 'short', beard: true, bg: '#ECEFEE', hc: '#1D1510' },
  ayesha: { skin: '#C98F6C', shirt: '#F4B942', hair: 'dupatta', beard: false, bg: '#FEF7E6', hc: '#24170F', dup: '#087F5B' },
  hamza: { skin: '#BF8360', shirt: '#3E6FB0', hair: 'short', beard: false, bg: '#E8EEF8', hc: '#1E1612' },
};

export const seedWorkers = () => [
  { id: 'imran', name: 'Muhammad Imran', nameUr: 'محمد عمران', cat: 'plumber', exp: 12, area: 'G-11', city: 'Islamabad', km: 1.2, rating: 4.8, count: 126, jobs: 142, price: 800, status: 'available', freeAt: '', skills: ['Leak repair', 'Geyser fitting', 'Bathroom fittings', 'Pipe replacement'], langs: 'Urdu, Punjabi', phone: '0300-5551234', since: '2024', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: '9 AM – 7 PM', lat: 33.6844, lng: 73.0479, reviews: [
    { by: 'Sana R.', area: 'G-11/3', stars: 5, q: 5, p: 5, t: 4, text: 'Fixed the geyser pipe in one visit and explained what had worn out. Cleaned up after.', date: '2 weeks ago', tags: ['Fixed first time', 'Clean work'] },
    { by: 'Faisal M.', area: 'G-10/2', stars: 5, q: 5, p: 5, t: 5, text: 'Bathroom mixer replaced. Price was as agreed in chat, no surprises.', date: '1 month ago', tags: ['Fair price'] },
    { by: 'Rabia A.', area: 'F-11/1', stars: 4, q: 4, p: 5, t: 3, text: 'Good work, came about 40 minutes later than said but called ahead.', date: '1 month ago', tags: ['Polite'] },
  ] },
  { id: 'rehman', name: 'Abdul Rehman', nameUr: 'عبدالرحمٰن', cat: 'electrician', exp: 15, area: 'G-10', city: 'Islamabad', km: 2.1, rating: 4.9, count: 210, jobs: 236, price: 700, status: 'available', freeAt: '', skills: ['House wiring', 'UPS & inverter', 'Fault finding'], langs: 'Urdu, Pashto', phone: '0301-5552345', since: '2024', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], hours: '8 AM – 9 PM', lat: 33.6750, lng: 73.0350, reviews: [
    { by: 'Usman K.', area: 'G-10/4', stars: 5, q: 5, p: 5, t: 5, text: 'Found the short circuit quickly. Very calm and careful.', date: '5 days ago', tags: ['Fixed first time'] },
  ] },
  { id: 'shahid', name: 'Shahid Mehmood', nameUr: 'شاہد محمود', cat: 'ac', exp: 8, area: 'F-11', city: 'Islamabad', km: 3.4, rating: 4.6, count: 88, jobs: 97, price: 1500, status: 'busy', freeAt: '6:00 PM', skills: ['AC service', 'Gas refill', 'Installation'], langs: 'Urdu', phone: '0302-5553456', since: '2025', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: '10 AM – 8 PM', lat: 33.6900, lng: 73.0250, reviews: [
    { by: 'Hina S.', area: 'F-11/2', stars: 5, q: 5, p: 4, t: 5, text: 'AC cooling is back. Showed the gas pressure reading before and after.', date: '3 weeks ago', tags: ['On time'] },
  ] },
  { id: 'bilal', name: 'Bilal Ahmed', nameUr: 'بلال احمد', cat: 'plumber', exp: 5, area: 'G-9', city: 'Islamabad', km: 2.8, rating: 4.4, count: 31, jobs: 35, price: 600, status: 'available', freeAt: '', skills: ['Tap & mixer', 'Water tank & pump', 'Leak repair'], langs: 'Urdu, Punjabi', phone: '0303-5554567', since: '2025', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], hours: '9 AM – 6 PM', lat: 33.6700, lng: 73.0600, reviews: [
    { by: 'Kamran T.', area: 'G-9/1', stars: 4, q: 4, p: 4, t: 5, text: 'Pump wiring sorted. Good for small jobs.', date: '2 months ago', tags: ['On time'] },
  ] },
  { id: 'naveed', name: 'Naveed Akhtar', nameUr: 'نوید اختر', cat: 'carpenter', exp: 20, area: 'I-8', city: 'Islamabad', km: 4.0, rating: 4.7, count: 64, jobs: 70, price: 1000, status: 'available', freeAt: '', skills: ['Door repair', 'Cupboards', 'Locks & hinges'], langs: 'Urdu, Punjabi', phone: '0304-5555678', since: '2024', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: '9 AM – 6 PM', lat: 33.6557, lng: 73.0256, reviews: [
    { by: 'Maryam N.', area: 'I-8/3', stars: 5, q: 5, p: 5, t: 4, text: 'Kitchen cupboard hinges replaced, doors close properly now.', date: '1 week ago', tags: ['Clean work'] },
  ] },
  { id: 'tariq', name: 'Tariq Mehmood', nameUr: 'طارق محمود', cat: 'appliance', exp: 11, area: 'Satellite Town', city: 'Rawalpindi', km: 8.6, rating: 4.5, count: 52, jobs: 58, price: 900, status: 'available', freeAt: '', skills: ['Fridge', 'Washing machine', 'Microwave'], langs: 'Urdu, Punjabi', phone: '0305-5556789', since: '2024', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: '10 AM – 7 PM', lat: 33.5973, lng: 73.0479, reviews: [] },
  { id: 'zahid', name: 'Zahid Hussain', nameUr: 'زاہد حسین', cat: 'painter', exp: 10, area: 'Saddar', city: 'Rawalpindi', km: 9.2, rating: 4.5, count: 40, jobs: 44, price: 2500, status: 'off', freeAt: 'Tomorrow', skills: ['Room paint', 'Seepage fix', 'Exterior'], langs: 'Urdu', phone: '0306-5557890', since: '2025', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], hours: '8 AM – 5 PM', lat: 33.5973, lng: 73.0479, reviews: [] },
  { id: 'asif', name: 'Asif Ali', nameUr: 'آصف علی', cat: 'mechanic', exp: 9, area: 'G-13', city: 'Islamabad', km: 5.1, rating: 4.3, count: 27, jobs: 30, price: 1200, status: 'available', freeAt: '', skills: ['Car service', 'Battery', 'Bike repair'], langs: 'Urdu, Saraiki', phone: '0307-5558901', since: '2025', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: '9 AM – 8 PM', lat: 33.6500, lng: 73.0200, reviews: [] },
];

export const CUSTOMER = {
  name: 'Ayesha Khan',
  nameUr: 'عائشہ خان',
  address: 'House 24, Street 7, G-11/2, Islamabad',
  area: 'G-11/2',
  phone: '0333-5550000',
};

export const OB_STEPS = [
  { icon: 'globe', en: 'Choose your language', ur: 'اپنی زبان چنیں' },
  { icon: 'mic', en: 'Say your name', ur: 'اپنا نام بولیں' },
  { icon: 'briefcase', en: 'What is your work?', ur: 'آپ کا کام کیا ہے؟' },
  { icon: 'wrench', en: 'What can you do?', ur: 'آپ کیا کیا کر سکتے ہیں؟' },
  { icon: 'pin', en: 'Where do you work?', ur: 'آپ کہاں کام کرتے ہیں؟' },
  { icon: 'star', en: 'How many years of experience?', ur: 'کتنے سال کا تجربہ ہے؟' },
  { icon: 'camera', en: 'Add your photo', ur: 'اپنی تصویر لگائیں' },
  { icon: 'calendar', en: 'When can you work?', ur: 'آپ کب کام کر سکتے ہیں؟' },
  { icon: 'eye', en: 'Check your profile', ur: 'اپنی پروفائل دیکھیں' },
  { icon: 'checkCircle', en: 'Profile ready', ur: 'پروفائل تیار' },
];

export const STATUS_ORDER = ['requested', 'negotiating', 'agreed', 'confirmed', 'onway', 'working', 'done', 'closed', 'reviewed'];
export const stIdx = (s) => STATUS_ORDER.indexOf(s);

export const DEFAULT_JOB = () => ({
  id: 'RR-2611-0427',
  workerId: 'imran',
  cat: 'plumber',
  title: 'Leak under kitchen sink',
  voice: 'Kitchen ke sink ke neeche se paani tapak raha hai, pipe purana lagta hai. Aaj shaam tak koi aa jaye to behtar hai.',
  text: '',
  details: ['Leaking constantly, even with tap closed', 'Shut-off valve under the sink: Yes'],
  photo: 'sample',
  time: 'Today, 5–7 PM',
  address: CUSTOMER.address,
  price: null,
  offers: [],
  status: 'requested',
  reviewed: false,
  log: [],
});

/** Simple on-device keyword classifier (prototype stand-in for LLM) */
const KW = {
  plumber: ['paani', 'pani', 'pipe', 'nalka', 'nal', 'leak', 'tapak', 'sink', 'geyser', 'gizer', 'tank', 'tanki', 'flush', 'commode', 'drain', 'gutter', 'motor', 'پانی', 'نلکا', 'پائپ', 'لیک', 'گیزر', 'ٹینکی', 'tap', 'water', 'bathroom', 'washroom'],
  electrician: ['bijli', 'light', 'wiring', 'switch', 'pankha', 'fan', 'ups', 'inverter', 'current', 'short', 'socket', 'board', 'breaker', 'meter', 'بجلی', 'پنکھا', 'سوئچ', 'وائرنگ', 'لائٹ'],
  ac: [' ac ', 'a.c', 'a/c', 'cooling', 'thanda', 'gas', 'split', 'inverter ac', 'compressor', 'اے سی', 'کولنگ'],
  carpenter: ['darwaza', 'door', 'lakri', 'almari', 'cupboard', 'drawer', 'furniture', 'kabza', 'hinge', 'lock', 'tala', 'دروازہ', 'الماری', 'لکڑی', 'تالا'],
  painter: ['rang', 'paint', 'seelan', 'seepage', 'deewar', 'wall', 'polish', 'رنگ', 'سیلن', 'دیوار'],
  mechanic: ['gari', 'gaari', 'car', 'bike', 'engine', 'battery', 'tyre', 'puncture', 'گاڑی', 'بائیک', 'انجن'],
  appliance: ['fridge', 'freezer', 'washing', 'machine', 'microwave', 'oven', 'dispenser', 'فریج', 'مشین'],
};

export function classify(text) {
  const t = ' ' + String(text || '').toLowerCase() + ' ';
  let best = null;
  let score = 0;
  for (const [k, list] of Object.entries(KW)) {
    let s = 0;
    for (const w of list) {
      if (t.includes(w)) s += w.length > 3 ? 2 : 1;
    }
    if (s > score) { score = s; best = k; }
  }
  return score ? best : null;
}
