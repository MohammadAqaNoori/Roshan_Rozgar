/**
 * Static data — categories, skills, areas, avatar looks, seed workers, customer.
 * v2.0 — Localized for Afghanistan (Dari + English)
 */

// ── Trade categories ──────────────────────────────────────────────────────────
export const CATS = [
  { id: 'plumber',     en: 'Plumber',         fa: 'نل‌بند',         icon: 'droplet', hint: 'Leaks, taps, pipes' },
  { id: 'electrician', en: 'Electrician',      fa: 'برق‌کار',        icon: 'zap',     hint: 'Wiring, fans, UPS' },
  { id: 'ac',          en: 'AC Technician',    fa: 'مکانیک تکلیف',   icon: 'snow',    hint: 'Service, gas, install' },
  { id: 'carpenter',   en: 'Carpenter',        fa: 'نجار',           icon: 'hammer',  hint: 'Doors, cupboards, furniture' },
  { id: 'painter',     en: 'Painter',          fa: 'رنگمال',         icon: 'brush',   hint: 'Rooms, exterior, seepage' },
  { id: 'mechanic',    en: 'Mechanic',         fa: 'مکانیک',         icon: 'car',     hint: 'Car & bike repair' },
  { id: 'mason',       en: 'Mason / Builder',  fa: 'معمار',          icon: 'home',    hint: 'Bricks, concrete, tiling' },
  { id: 'tailor',      en: 'Tailor',           fa: 'خیاط',           icon: 'scissors',hint: 'Clothes, alterations' },
  { id: 'appliance',   en: 'Appliance Repair', fa: 'مرمت وسایل برقی', icon: 'washer',  hint: 'Fridge, washing machine' },
  { id: 'general',     en: 'General Repair',   fa: 'مرمت عمومی',     icon: 'wrench',  hint: 'Odd jobs at home' },
];

export const catBy = (id) => CATS.find((c) => c.id === id) || CATS[0];

// ── Skills per category ───────────────────────────────────────────────────────
export const SKILLS = {
  plumber:     [['Leak repair', 'رفع نشتی', 'droplet'], ['Tap & mixer', 'شیر و میکسر', 'wrench'], ['Geyser fitting', 'نصب گیزر', 'sun'], ['Pipe replacement', 'تعویض لوله', 'route'], ['Bathroom fittings', 'تجهیزات حمام', 'home'], ['Water tank & pump', 'تانک و پمپ آب', 'droplet']],
  electrician: [['House wiring', 'سیم‌کشی خانه', 'zap'], ['Fan & light', 'پنکه و چراغ', 'sun'], ['UPS & inverter', 'یو‌پی‌اس', 'zap'], ['Switchboard', 'تابلو برق', 'layout'], ['Fault finding', 'یافتن خرابی', 'search'], ['Solar panel', 'پانل خورشیدی', 'sun']],
  ac:          [['AC service', 'سرویس کولر', 'snow'], ['Gas refill', 'شارژ گاز', 'snow'], ['Installation', 'نصب', 'wrench'], ['PCB repair', 'تعمیر کارت', 'zap']],
  carpenter:   [['Door repair', 'تعمیر دروازه', 'home'], ['Cupboards', 'کمد و قفسه', 'layout'], ['Furniture polish', 'پالیش مبل', 'brush'], ['Locks & hinges', 'قفل و لولا', 'lock']],
  painter:     [['Room paint', 'رنگ‌کاری اتاق', 'brush'], ['Seepage fix', 'رفع رطوبت', 'droplet'], ['Exterior', 'نمای بیرونی', 'home'], ['Polish & enamel', 'پالیش', 'brush']],
  mechanic:    [['Car service', 'سرویس موتر', 'car'], ['Bike repair', 'تعمیر موترسایکل', 'car'], ['Battery', 'باتری', 'zap'], ['Denting & painting', 'پنچرگیری و رنگ', 'hammer']],
  mason:       [['Brickwork', 'آجرچینی', 'home'], ['Plastering', 'اندود کاری', 'wrench'], ['Tiling', 'کاشی‌کاری', 'layout'], ['Concrete', 'بتون‌ریزی', 'hammer']],
  tailor:      [['Men\'s wear', 'لباس مردانه', 'scissors'], ['Women\'s wear', 'لباس زنانه', 'scissors'], ['Alterations', 'تعدیل لباس', 'wrench'], ['Traditional dress', 'لباس ملی', 'star']],
  appliance:   [['Fridge', 'یخچال', 'washer'], ['Washing machine', 'ماشین لباسشویی', 'washer'], ['Microwave', 'مایکروویو', 'zap'], ['Water dispenser', 'دیسپنسر آب', 'droplet']],
  general:     [['Drilling & fixing', 'حفاری و نصب', 'wrench'], ['Curtain rods', 'میله پرده', 'home'], ['Furniture assembly', 'مونتاژ مبلمان', 'hammer'], ['Small repairs', 'تعمیرات کوچک', 'wrench']],
};

// ── Afghan cities and districts ───────────────────────────────────────────────
export const AREAS = [
  { id: 'Shahr-e-Naw',    city: 'Kabul',           x: 250, y: 250 },
  { id: 'Karte Seh',      city: 'Kabul',           x: 310, y: 230 },
  { id: 'Macroyan',       city: 'Kabul',           x: 370, y: 250 },
  { id: 'Wazir Akbar Khan', city: 'Kabul',         x: 290, y: 190 },
  { id: 'Khair Khana',    city: 'Kabul',           x: 230, y: 170 },
  { id: 'Pul-e-Charkhi',  city: 'Kabul',           x: 450, y: 280 },
  { id: 'Herat City',     city: 'Herat',           x: 110, y: 350 },
  { id: 'Injil',          city: 'Herat',           x: 90,  y: 380 },
  { id: 'Mazar City',     city: 'Mazar-i-Sharif',  x: 580, y: 160 },
  { id: 'Balkh',          city: 'Mazar-i-Sharif',  x: 540, y: 140 },
  { id: 'Kandahar City',  city: 'Kandahar',        x: 300, y: 480 },
  { id: 'Dand',           city: 'Kandahar',        x: 330, y: 500 },
];

// ── Avatar visual looks ───────────────────────────────────────────────────────
export const LOOKS = {
  ahmad:   { skin: '#B97A56', shirt: '#006400', hair: 'short',  beard: true,  bg: '#E3F2EC', hc: '#2A1D16' },
  karim:   { skin: '#A86B48', shirt: '#C8102E', hair: 'pakol',  beard: true,  bg: '#FDECEA', hc: '#3A2A20' },
  nasir:   { skin: '#C68A63', shirt: '#3E6FB0', hair: 'short',  beard: false, bg: '#E8EEF8', hc: '#1E1612' },
  habib:   { skin: '#9C6444', shirt: '#8A5A3B', hair: 'topi',   beard: true,  bg: '#F4ECE4', hc: '#BFB7B0' },
  zarif:   { skin: '#B5764F', shirt: '#C8102E', hair: 'short',  beard: false, bg: '#FCEDED', hc: '#241914' },
  wahid:   { skin: '#C9906A', shirt: '#006400', hair: 'short',  beard: true,  bg: '#E3F2EC', hc: '#2B1E17' },
  omar:    { skin: '#A96F4C', shirt: '#5E6A66', hair: 'pakol',  beard: false, bg: '#F0F2F1', hc: '#2A1D16' },
  yusuf:   { skin: '#B47450', shirt: '#202B29', hair: 'short',  beard: true,  bg: '#ECEFEE', hc: '#1D1510' },
  mariam:  { skin: '#C98F6C', shirt: '#F4B942', hair: 'hijab',  beard: false, bg: '#FEF7E6', hc: '#24170F', dup: '#006400' },
  farida:  { skin: '#BF8360', shirt: '#3E6FB0', hair: 'hijab',  beard: false, bg: '#E8EEF8', hc: '#1E1612', dup: '#C8102E' },
};

// ── Seed workers (Afghan, Dari names) ─────────────────────────────────────────
export const seedWorkers = () => [
  {
    id: 'ahmad', name: 'Ahmad Shah', nameFa: 'احمد شاه', cat: 'plumber',
    exp: 11, area: 'Shahr-e-Naw', city: 'Kabul', km: 1.4,
    rating: 4.8, count: 112, jobs: 128, price: 300, status: 'available', freeAt: '',
    skills: ['Leak repair', 'Geyser fitting', 'Bathroom fittings', 'Pipe replacement'],
    langs: 'Dari, Pashto', phone: '0700-111001', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '8 AM – 7 PM', lat: 34.5260, lng: 69.1781,
    reviews: [
      { by: 'Mariam N.', area: 'Shahr-e-Naw', stars: 5, q: 5, p: 5, t: 4, text: 'Repaired the leaking pipe quickly and cleaned up after. Very professional.', date: '1 week ago', tags: ['Fixed first time', 'Clean work'] },
      { by: 'Khalid F.', area: 'Karte Seh',   stars: 5, q: 5, p: 5, t: 5, text: 'Replaced bathroom mixer as agreed. No surprises on price.', date: '3 weeks ago', tags: ['Fair price'] },
    ],
  },
  {
    id: 'karim', name: 'Abdul Karim', nameFa: 'عبدالکریم', cat: 'electrician',
    exp: 14, area: 'Wazir Akbar Khan', city: 'Kabul', km: 2.3,
    rating: 4.9, count: 198, jobs: 221, price: 250, status: 'available', freeAt: '',
    skills: ['House wiring', 'UPS & inverter', 'Fault finding', 'Solar panel'],
    langs: 'Dari', phone: '0700-222002', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hours: '7 AM – 9 PM', lat: 34.5280, lng: 69.1950,
    reviews: [
      { by: 'Omar Z.', area: 'Macroyan', stars: 5, q: 5, p: 5, t: 5, text: 'Found the short circuit in minutes. Calm and careful work.', date: '4 days ago', tags: ['Fixed first time'] },
    ],
  },
  {
    id: 'nasir', name: 'Nasir Ahmad', nameFa: 'نصیر احمد', cat: 'ac',
    exp: 7, area: 'Macroyan', city: 'Kabul', km: 3.1,
    rating: 4.6, count: 76, jobs: 84, price: 500, status: 'busy', freeAt: '5:00 PM',
    skills: ['AC service', 'Gas refill', 'Installation'],
    langs: 'Dari, Pashto', phone: '0700-333003', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    hours: '9 AM – 7 PM', lat: 34.5200, lng: 69.2050,
    reviews: [
      { by: 'Fatima R.', area: 'Karte Seh', stars: 5, q: 5, p: 4, t: 5, text: 'AC cooling restored. He showed the gas pressure reading before and after.', date: '2 weeks ago', tags: ['On time'] },
    ],
  },
  {
    id: 'habib', name: 'Habibullah', nameFa: 'حبیب‌الله', cat: 'carpenter',
    exp: 18, area: 'Khair Khana', city: 'Kabul', km: 4.2,
    rating: 4.7, count: 59, jobs: 65, price: 400, status: 'available', freeAt: '',
    skills: ['Door repair', 'Cupboards', 'Furniture polish', 'Locks & hinges'],
    langs: 'Dari', phone: '0700-444004', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '8 AM – 6 PM', lat: 34.5450, lng: 69.1650,
    reviews: [
      { by: 'Zarifa H.', area: 'Khair Khana', stars: 5, q: 5, p: 5, t: 4, text: 'Fixed the broken door hinges perfectly. Very skilled ustad.', date: '5 days ago', tags: ['Clean work'] },
    ],
  },
  {
    id: 'wahid', name: 'Wahidullah', nameFa: 'واحدالله', cat: 'mason',
    exp: 15, area: 'Herat City', city: 'Herat', km: 2.0,
    rating: 4.8, count: 87, jobs: 95, price: 350, status: 'available', freeAt: '',
    skills: ['Brickwork', 'Plastering', 'Tiling', 'Concrete'],
    langs: 'Dari, Pashto', phone: '0700-555005', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '7 AM – 6 PM', lat: 34.3482, lng: 62.2041,
    reviews: [],
  },
  {
    id: 'zarif', name: 'Zarif Khan', nameFa: 'ظریف خان', cat: 'painter',
    exp: 9, area: 'Mazar City', city: 'Mazar-i-Sharif', km: 3.8,
    rating: 4.5, count: 44, jobs: 49, price: 800, status: 'off', freeAt: 'Tomorrow',
    skills: ['Room paint', 'Seepage fix', 'Exterior', 'Polish & enamel'],
    langs: 'Dari, Uzbeki', phone: '0700-666006', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    hours: '8 AM – 5 PM', lat: 36.7069, lng: 67.1100,
    reviews: [],
  },
  {
    id: 'omar', name: 'Omar Farooq', nameFa: 'عمر فاروق', cat: 'mechanic',
    exp: 10, area: 'Kandahar City', city: 'Kandahar', km: 5.5,
    rating: 4.3, count: 31, jobs: 35, price: 450, status: 'available', freeAt: '',
    skills: ['Car service', 'Bike repair', 'Battery', 'Denting & painting'],
    langs: 'Pashto, Dari', phone: '0700-777007', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '9 AM – 8 PM', lat: 31.6289, lng: 65.7372,
    reviews: [],
  },
  {
    id: 'yusuf', name: 'Yusuf Rahimi', nameFa: 'یوسف رحیمی', cat: 'tailor',
    exp: 12, area: 'Karte Seh', city: 'Kabul', km: 1.8,
    rating: 4.6, count: 53, jobs: 60, price: 200, status: 'available', freeAt: '',
    skills: ["Men's wear", "Women's wear", 'Alterations', 'Traditional dress'],
    langs: 'Dari', phone: '0700-888008', since: '2025',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    hours: '9 AM – 7 PM', lat: 34.5100, lng: 69.1700,
    reviews: [],
  },
];

// ── Seed customer ─────────────────────────────────────────────────────────────
export const CUSTOMER = {
  name: 'Mariam Noori',
  nameFa: 'مریم نوری',
  address: 'House 12, Street 3, Shahr-e-Naw, Kabul',
  area: 'Shahr-e-Naw',
  phone: '0700-100100',
};

// ── Onboarding steps ──────────────────────────────────────────────────────────
export const OB_STEPS = [
  { icon: 'globe',       en: 'Choose your language',         fa: 'زبان خود را انتخاب کنید' },
  { icon: 'keyboard',    en: 'What is your name?',           fa: 'نام شما چیست؟' },
  { icon: 'briefcase',   en: 'What is your work?',           fa: 'کار شما چیست؟' },
  { icon: 'wrench',      en: 'What can you do?',             fa: 'چه کارهایی می‌توانید انجام دهید؟' },
  { icon: 'pin',         en: 'Where do you work?',           fa: 'کجا کار می‌کنید؟' },
  { icon: 'star',        en: 'How many years of experience?', fa: 'چند سال تجربه دارید؟' },
  { icon: 'camera',      en: 'Add your photo',               fa: 'عکس خود را اضافه کنید' },
  { icon: 'calendar',    en: 'When can you work?',           fa: 'چه زمانی می‌توانید کار کنید؟' },
  { icon: 'eye',         en: 'Check your profile',           fa: 'پروفایل خود را بررسی کنید' },
  { icon: 'checkCircle', en: 'Profile ready',                fa: 'پروفایل آماده است' },
];

// ── Job status state machine ──────────────────────────────────────────────────
export const STATUS_ORDER = ['requested', 'negotiating', 'agreed', 'confirmed', 'onway', 'working', 'done', 'closed', 'reviewed'];
export const stIdx = (s) => STATUS_ORDER.indexOf(s);

// ── Default demo job ──────────────────────────────────────────────────────────
export const DEFAULT_JOB = () => ({
  id: 'KR-2611-0001',
  workerId: 'ahmad',
  cat: 'plumber',
  title: 'Leaking pipe under kitchen sink',
  voice: 'لوله زیر آشپزخانه نشت می‌کند، آب می‌چکد. لطفاً امروز بیایید.',
  text: '',
  details: ['Leaking constantly, even with tap closed', 'Shut-off valve under the sink: Yes'],
  photo: 'sample',
  time: 'Today, 4–6 PM',
  address: CUSTOMER.address,
  price: null,
  offers: [],
  status: 'requested',
  reviewed: false,
  log: [],
});

// ── Keyword classifier (Dari + English) ──────────────────────────────────────
const KW = {
  plumber:     ['paani', 'pani', 'pipe', 'nal', 'nalk', 'leak', 'tapak', 'sink', 'geyser', 'tank', 'flush', 'drain', 'motor', 'آب', 'لوله', 'نشتی', 'نل', 'تانک', 'گیزر', 'tap', 'water', 'bathroom'],
  electrician: ['bijli', 'barq', 'برق', 'light', 'wiring', 'switch', 'fan', 'ups', 'inverter', 'current', 'short', 'socket', 'breaker', 'solar', 'سیم', 'برق‌کار', 'چراغ', 'پنکه'],
  ac:          [' ac ', 'a.c', 'cooling', 'thanda', 'gas', 'compressor', 'کولر', 'سرما', 'تکلیف'],
  carpenter:   ['door', 'darwaza', 'wood', 'cupboard', 'furniture', 'hinge', 'lock', 'دروازه', 'نجار', 'کمد', 'مبل', 'قفل'],
  painter:     ['rang', 'paint', 'seepage', 'wall', 'رنگ', 'رنگمال', 'دیوار', 'رطوبت'],
  mechanic:    ['car', 'motar', 'موتر', 'bike', 'engine', 'battery', 'tyre', 'مکانیک', 'موترسایکل'],
  mason:       ['brick', 'concrete', 'tile', 'plaster', 'آجر', 'معمار', 'بتون', 'کاشی'],
  tailor:      ['cloth', 'dress', 'stitch', 'alter', 'لباس', 'خیاط', 'دوختن', 'تعدیل'],
  appliance:   ['fridge', 'freezer', 'washing', 'machine', 'microwave', 'dispenser', 'یخچال', 'ماشین'],
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
