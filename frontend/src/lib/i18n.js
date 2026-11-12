/**
 * Karigar — onboarding translation strings
 * Keys: en (English) | fa (Dari/Afghan Persian)
 *
 * Usage: TR[lang]['key']  — always returns a string.
 * If a key is missing for the requested lang, falls back to 'en'
 * and logs a warning in development.
 */

export const TR = {
  en: {
    // ── Header ──────────────────────────────────────────────────────────────
    'voice-signup':        'Voice sign-up',
    'back':                'Back',

    // ── Navigation / progress ───────────────────────────────────────────────
    'next':                'Next',
    'skip':                'Skip',
    'create-profile':      'Create my profile',

    // ── Step 0: Language ─────────────────────────────────────────────────────
    'choose-lang':         'Choose your language',
    'choose-lang-hint':    'Tap one. You can change it any time.',
    'speaker-hint':        'Tap the yellow speaker on any step to hear it read aloud.',

    // ── Step 1: Name ─────────────────────────────────────────────────────────
    'what-is-name':        'What is your name?',
    'type-name-below':     'Type your name below.',
    'your-full-name':      'Your full name',
    'eg-name':             'e.g. Ahmad Shah',
    'name-saved':          'Name saved',
    'use-this-name':       'Use this name',
    'first-name-note':     'Only your first name is shown to customers.',

    // ── Step 2: Trade ────────────────────────────────────────────────────────
    'what-is-work':        'What is your work?',
    'tap-main-trade':      'Tap your main trade.',

    // ── Step 3: Skills ───────────────────────────────────────────────────────
    'what-can-you-do':     'What can you do?',
    'tap-all-apply':       'Tap all that apply.',
    'something-else':      'Something else?',
    'say-and-add':         'Say it and we\'ll add it.',

    // ── Step 4: Area ─────────────────────────────────────────────────────────
    'where-work':          'Where do you work?',
    'choose-area-hint':    'Choose the area where you take jobs.',
    'use-location':        'Use my current location',
    'getting-location':    'Getting your location…',
    'area-selected':       'Area selected',
    'or-pick-below':       'Or pick manually below',
    'location-denied':     'Location permission denied. Please pick an area below.',
    'location-unsupported':'Geolocation not supported by your browser.',

    // ── Step 5: Experience ───────────────────────────────────────────────────
    'how-many-years':      'How many years of experience?',
    'tap-one':             'Tap one.',
    'years':               'years',
    'exp-1-2':             '1–2',
    'exp-3-5':             '3–5',
    'exp-6-10':            '6–10',
    'exp-10plus':          '10+',
    'exp-1-2-label':       '1–2 years',
    'exp-3-5-label':       '3–5 years',
    'exp-6-10-label':      '6–10 years',
    'exp-10plus-label':    '10+ years',

    // ── Step 6: Photo ────────────────────────────────────────────────────────
    'add-photo':           'Add your photo',
    'photo-hint':          'Customers trust a clear face photo. You can skip this.',
    'take-upload-photo':   'Take or upload photo',
    'use-sample-photo':    'Use sample photo',
    'photo-tip':           'Clear face, good lighting',

    // ── Step 7: Schedule ─────────────────────────────────────────────────────
    'when-work':           'When can you work?',
    'tap-days':            'Tap the days you usually work.',
    'usual-hours':         'Usual hours',
    'sat': 'Sat', 'sun': 'Sun', 'mon': 'Mon', 'tue': 'Tue',
    'wed': 'Wed', 'thu': 'Thu', 'fri': 'Fri',
    'morning':             '9 AM – 1 PM',
    'afternoon':           '1 PM – 6 PM',
    'evening':             '6 PM – 10 PM',
    'full-day':            '9 AM – 7 PM',

    // ── Step 8: Preview ──────────────────────────────────────────────────────
    'check-profile':       'Check your profile',
    'preview-hint':        'This is what customers will see. Tap a pencil to change something.',
    'available-now':       'Available now',
    'edit-name':           'Name',
    'edit-work':           'Work',
    'edit-skills':         'Skills',
    'edit-area':           'Area',
    'edit-exp':            'Experience',
    'edit-days':           'Days',
    'selected':            'selected',
    'yrs':                 'yrs',
    'days':                'days',

    // ── Step 9: Success ──────────────────────────────────────────────────────
    'profile-ready':       'Profile ready',
    'congratulations':     'Congratulations! Your profile is ready.',
    'profile-is-live':     'Your profile is live',
    'profile-live-desc':   'Customers near {area} can now find you. Keep your status on "Available" to get job requests.',
    'go-home':             'Go to my home screen',
  },

  fa: {
    // ── Header ──────────────────────────────────────────────────────────────
    'voice-signup':        'ثبت‌نام صوتی',
    'back':                'قبلی',

    // ── Navigation / progress ───────────────────────────────────────────────
    'next':                'بعدی',
    'skip':                'رد کردن',
    'create-profile':      'پروفایل من را بسازید',

    // ── Step 0: Language ─────────────────────────────────────────────────────
    'choose-lang':         'زبان خود را انتخاب کنید',
    'choose-lang-hint':    'یکی را انتخاب کنید. می‌توانید هر وقت تغییر دهید.',
    'speaker-hint':        'برای شنیدن هر مرحله، دکمه زرد بلندگو را بزنید.',

    // ── Step 1: Name ─────────────────────────────────────────────────────────
    'what-is-name':        'نام شما چیست؟',
    'type-name-below':     'نام خود را در زیر بنویسید.',
    'your-full-name':      'نام کامل شما',
    'eg-name':             'مثلاً: احمد شاه',
    'name-saved':          'نام ذخیره شد',
    'use-this-name':       'این نام را انتخاب کنید',
    'first-name-note':     'تنها نام شما به مشتریان نشان داده می‌شود.',

    // ── Step 2: Trade ────────────────────────────────────────────────────────
    'what-is-work':        'کار شما چیست؟',
    'tap-main-trade':      'کار اصلی خود را انتخاب کنید.',

    // ── Step 3: Skills ───────────────────────────────────────────────────────
    'what-can-you-do':     'چه کارهایی می‌توانید انجام دهید؟',
    'tap-all-apply':       'همه موارد مناسب را انتخاب کنید.',
    'something-else':      'چیز دیگری هم هست؟',
    'say-and-add':         'بگویید، ما اضافه می‌کنیم.',

    // ── Step 4: Area ─────────────────────────────────────────────────────────
    'where-work':          'کجا کار می‌کنید؟',
    'choose-area-hint':    'منطقه‌ای که در آن کار می‌کنید را انتخاب کنید.',
    'use-location':        'موقعیت فعلی من',
    'getting-location':    'در حال یافتن موقعیت شما…',
    'area-selected':       'منطقه انتخاب شد',
    'or-pick-below':       'یا از زیر انتخاب کنید',
    'location-denied':     'اجازه موقعیت‌یابی داده نشد. لطفاً منطقه را از زیر انتخاب کنید.',
    'location-unsupported':'مرورگر شما موقعیت‌یابی را پشتیبانی نمی‌کند.',

    // ── Step 5: Experience ───────────────────────────────────────────────────
    'how-many-years':      'چند سال تجربه دارید؟',
    'tap-one':             'یکی را انتخاب کنید.',
    'years':               'سال',
    'exp-1-2':             '۱–۲',
    'exp-3-5':             '۳–۵',
    'exp-6-10':            '۶–۱۰',
    'exp-10plus':          '۱۰+',
    'exp-1-2-label':       '۱ تا ۲ سال',
    'exp-3-5-label':       '۳ تا ۵ سال',
    'exp-6-10-label':      '۶ تا ۱۰ سال',
    'exp-10plus-label':    'بیشتر از ۱۰ سال',

    // ── Step 6: Photo ────────────────────────────────────────────────────────
    'add-photo':           'عکس خود را اضافه کنید',
    'photo-hint':          'مشتریان به عکس واضح چهره اعتماد می‌کنند. می‌توانید رد کنید.',
    'take-upload-photo':   'عکس بگیرید یا آپلود کنید',
    'use-sample-photo':    'استفاده از عکس نمونه',
    'photo-tip':           'چهره واضح، نور خوب',

    // ── Step 7: Schedule ─────────────────────────────────────────────────────
    'when-work':           'چه زمانی می‌توانید کار کنید؟',
    'tap-days':            'روزهایی که معمولاً کار می‌کنید را انتخاب کنید.',
    'usual-hours':         'ساعات معمول',
    'sat': 'شنبه', 'sun': 'یکشنبه', 'mon': 'دوشنبه', 'tue': 'سه‌شنبه',
    'wed': 'چهارشنبه', 'thu': 'پنجشنبه', 'fri': 'جمعه',
    'morning':             'صبح (۹ تا ۱)',
    'afternoon':           'بعد از ظهر (۱ تا ۶)',
    'evening':             'شب (۶ تا ۱۰)',
    'full-day':            'تمام روز (۹ تا ۷)',

    // ── Step 8: Preview ──────────────────────────────────────────────────────
    'check-profile':       'پروفایل خود را بررسی کنید',
    'preview-hint':        'این چیزی است که مشتریان می‌بینند. برای تغییر، روی مداد بزنید.',
    'available-now':       'الان آماده',
    'edit-name':           'نام',
    'edit-work':           'کار',
    'edit-skills':         'مهارت‌ها',
    'edit-area':           'منطقه',
    'edit-exp':            'تجربه',
    'edit-days':           'روزها',
    'selected':            'انتخاب شده',
    'yrs':                 'سال',
    'days':                'روز',

    // ── Step 9: Success ──────────────────────────────────────────────────────
    'profile-ready':       'پروفایل آماده است',
    'congratulations':     'تبریک! پروفایل شما آماده است.',
    'profile-is-live':     'پروفایل شما فعال است',
    'profile-live-desc':   'مشتریان نزدیک {area} اکنون می‌توانند شما را پیدا کنند. وضعیت خود را روی "آماده" نگه دارید.',
    'go-home':             'صفحه اصلی من',
  },
};

/**
 * tr(lang, key, vars)
 * Returns the translated string for the given language and key.
 * Falls back to English if the key is missing for the requested lang.
 * Replaces {placeholder} tokens with values from the vars object.
 */
export function tr(lang, key, vars = {}) {
  const dict = TR[lang] ?? TR['en'];
  let str = dict[key];
  if (str === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing key "${key}" for lang "${lang}", falling back to English.`);
    }
    str = TR['en'][key] ?? key;
  }
  // Replace {placeholder} tokens
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

/**
 * toPersiDigits(str)
 * Converts ASCII digits 0-9 to Persian/Dari digits ۰-۹.
 */
export function toPersiDigits(str) {
  return String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
}
